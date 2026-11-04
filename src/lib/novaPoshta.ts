export const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

/** Відділення — самовивіз з відділення Нової Пошти */
export const NP_WAREHOUSE_BRANCH_REF = "841339c7-591a-42e2-8233-7a0a00f0ed6f";

/** Поштомат Нової Пошти */
export const NP_WAREHOUSE_POSTOMAT_REF = "f9316480-5f2d-425d-bc2c-ac7cd29decf0";

export type DeliveryMethod = "warehouse" | "postomat";

export const deliveryMethodOptions: {
  id: DeliveryMethod;
  label: string;
  description: string;
  typeRef: string;
  pointLabel: string;
}[] = [
  {
    id: "warehouse",
    label: "Відділеня Нової Пошти",
    description: "Самовивіз з відділення Нової Пошти",
    typeRef: NP_WAREHOUSE_BRANCH_REF,
    pointLabel: "Відділеня Нової Пошти",
  },
  {
    id: "postomat",
    label: "Поштомат Нової Пошти",
    description: "Отримання у поштоматі Нової Пошти",
    typeRef: NP_WAREHOUSE_POSTOMAT_REF,
    pointLabel: "Поштомат Нової Пошти",
  },
];

export type NovaPoshtaResponse<T> = {
  success: boolean;
  data: T;
  errors?: unknown[];
};

export function formatNovaPoshtaError(errors?: unknown[]): string | undefined {
  if (!errors?.length) return undefined;
  const first = errors[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first && "message" in first) {
    return String((first as { message: string }).message);
  }
  return undefined;
}

export async function callNovaPoshta<T>(
  apiKey: string,
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, unknown>,
): Promise<NovaPoshtaResponse<T>> {
  const response = await fetch(NOVA_POSHTA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      modelName,
      calledMethod,
      methodProperties,
    }),
  });

  return response.json();
}

export type WarehouseApiItem = {
  Ref: string;
  Description: string;
  Number?: string;
  CategoryOfWarehouse?: string;
};

export function formatWarehouseLabel(item: WarehouseApiItem): string {
  if (item.Number) {
    return `№${item.Number} — ${item.Description}`;
  }
  return item.Description;
}

function filterWarehousesByMethod(
  items: WarehouseApiItem[],
  deliveryMethod: DeliveryMethod,
  query: string,
): WarehouseApiItem[] {
  const category = deliveryMethod === "postomat" ? "Postomat" : "Branch";
  let filtered = items.filter((item) => item.CategoryOfWarehouse === category);

  if (!query) return filtered;

  if (/^\d+$/.test(query)) {
    return filtered.filter(
      (item) =>
        item.Number === query ||
        item.Description.includes(`№${query}`) ||
        item.Description.includes(`№${query}:`),
    );
  }

  const normalized = query.toLowerCase();
  return filtered.filter((item) => item.Description.toLowerCase().includes(normalized));
}

export async function searchWarehouses(
  apiKey: string,
  cityRef: string,
  deliveryMethod: DeliveryMethod,
  findByString: string,
): Promise<WarehouseApiItem[]> {
  const query = findByString.trim();

  if (query.length >= 1) {
    const search = await callNovaPoshta<WarehouseApiItem[]>(
      apiKey,
      "AddressGeneral",
      "getWarehouses",
      {
        CityRef: cityRef,
        FindByString: query,
        Limit: 50,
      },
    );

    if (!search.success) {
      throw new Error(
        formatNovaPoshtaError(search.errors) ?? "Nova Poshta warehouse search failed",
      );
    }

    const fromSearch = filterWarehousesByMethod(search.data ?? [], deliveryMethod, query);
    if (fromSearch.length) return fromSearch;
  }

  const all = await callNovaPoshta<WarehouseApiItem[]>(
    apiKey,
    "AddressGeneral",
    "getWarehouses",
    {
      CityRef: cityRef,
      Limit: 500,
    },
  );

  if (!all.success) {
    throw new Error(formatNovaPoshtaError(all.errors) ?? "Nova Poshta warehouse search failed");
  }

  return filterWarehousesByMethod(all.data ?? [], deliveryMethod, query);
}

export async function fetchWarehousesForCity(
  apiKey: string,
  cityRef: string,
  deliveryMethod: DeliveryMethod,
  limit: number = 50,
): Promise<WarehouseApiItem[]> {
  const typeRef =
    deliveryMethod === "postomat" ? NP_WAREHOUSE_POSTOMAT_REF : NP_WAREHOUSE_BRANCH_REF;
  const category = deliveryMethod === "postomat" ? "Postomat" : "Branch";

  const json = await callNovaPoshta<WarehouseApiItem[]>(
    apiKey,
    "AddressGeneral",
    "getWarehouses",
    {
      CityRef: cityRef,
      TypeOfWarehouseRef: typeRef,
      Limit: limit,
    },
  );

  if (json.success && json.data?.length) {
    return (json.data ?? []).filter((item) => item.CategoryOfWarehouse === category);
  }

  const fallback = await callNovaPoshta<WarehouseApiItem[]>(
    apiKey,
    "AddressGeneral",
    "getWarehouses",
    {
      CityRef: cityRef,
      Limit: limit,
    },
  );

  if (!fallback.success) {
    throw new Error(
      formatNovaPoshtaError(fallback.errors) ?? "Nova Poshta warehouses request failed",
    );
  }

  return (fallback.data ?? []).filter((item) => item.CategoryOfWarehouse === category);
}
