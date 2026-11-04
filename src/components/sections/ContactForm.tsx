"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DoodleIcon } from "@/components/ui/DoodleIcon";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NovaPoshtaLogo } from "@/components/ui/NovaPoshtaLogo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useOrderFlow } from "@/context/OrderFlowContext";
import {
  callNovaPoshta,
  deliveryMethodOptions,
  fetchWarehousesForCity,
  formatNovaPoshtaError,
  formatWarehouseLabel,
  searchWarehouses,
  type DeliveryMethod,
  type WarehouseApiItem,
} from "@/lib/novaPoshta";
import { getOrderAmountUah } from "@/lib/monobank";
import {
  formatUaNationalPhone,
  isUaPhoneComplete,
  parseUaNationalPhoneDigits,
  toUaE164,
  UA_PHONE_PREFIX,
} from "@/lib/uaPhone";

const NOVA_POSHTA_API_KEY = "server";
const WAREHOUSE_LIST_LIMIT = 500;

type CityOption = {
  ref: string;
  name: string;
};

type WarehouseOption = {
  ref: string;
  name: string;
  number: string;
};

function mapWarehouseItem(item: WarehouseApiItem): WarehouseOption {
  const number = item.Number != null ? String(item.Number) : "";
  return {
    ref: item.Ref,
    name: formatWarehouseLabel(item),
    number,
  };
}

const formStepTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

function FormStep({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={formStepTransition}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function filterWarehousesLocal(
  items: WarehouseOption[],
  query: string,
): WarehouseOption[] {
  const q = query.trim();
  if (!q) return items;

  if (/^\d+$/.test(q)) {
    return items.filter(
      (item) =>
        item.number === q ||
        item.name.includes(`№${q}`) ||
        item.name.includes(`№${q}:`),
    );
  }

  const normalized = q.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(normalized));
}

export function ContactForm() {
  const { showCheckout, selectedColor } = useOrderFlow();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [cityLocked, setCityLocked] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [showCityList, setShowCityList] = useState(false);
  const [selectedCityRef, setSelectedCityRef] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [warehouseInput, setWarehouseInput] = useState("");
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [allWarehouses, setAllWarehouses] = useState<WarehouseOption[]>([]);
  const [remoteWarehouses, setRemoteWarehouses] = useState<WarehouseOption[]>([]);
  const [warehousesCacheKey, setWarehousesCacheKey] = useState("");
  const [selectedWarehouseRef, setSelectedWarehouseRef] = useState("");
  const [selectedWarehouseName, setSelectedWarehouseName] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingRemoteSearch, setLoadingRemoteSearch] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderComment, setOrderComment] = useState("");
  const [contactRequested, setContactRequested] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [npError, setNpError] = useState("");

  const orderAmountUah = getOrderAmountUah();

  const warehouseFieldRef = useRef<HTMLDivElement>(null);
  const warehouseLoadIdRef = useRef(0);

  const hasApiKey = NOVA_POSHTA_API_KEY.length > 0;
  const activeDelivery = deliveryMethod
    ? deliveryMethodOptions.find((item) => item.id === deliveryMethod)
    : null;
  const warehouseCacheKey =
    selectedCityRef && deliveryMethod ? `${selectedCityRef}:${deliveryMethod}` : "";

  const showCityStep = deliveryMethod !== null;
  const showWarehouseStep = Boolean(selectedCityRef && deliveryMethod);
  const showCommentStep = Boolean(selectedWarehouseRef);

  const resetWarehouseSelection = useCallback(() => {
    setWarehouseInput("");
    setWarehouseOpen(false);
    setAllWarehouses([]);
    setRemoteWarehouses([]);
    setWarehousesCacheKey("");
    setSelectedWarehouseRef("");
    setSelectedWarehouseName("");
  }, []);

  const resetCitySelection = useCallback(() => {
    setCityQuery("");
    setCityLocked(false);
    setCities([]);
    setShowCityList(false);
    setSelectedCityRef("");
    setSelectedCityName("");
    resetWarehouseSelection();
  }, [resetWarehouseSelection]);

  useEffect(() => {
    if (showCheckout) return;

    setDeliveryMethod(null);
    setCustomerName("");
    setPhoneDigits("");
    setOrderComment("");
    resetCitySelection();
    setNpError("");
  }, [showCheckout, resetCitySelection]);

  const applyCitySelection = useCallback(
    (city: CityOption) => {
      setCityQuery(city.name);
      setSelectedCityRef(city.ref);
      setSelectedCityName(city.name);
      resetWarehouseSelection();
      setCityLocked(true);
      setShowCityList(false);
      setNpError("");
    },
    [resetWarehouseSelection],
  );

  const applyWarehouseSelection = useCallback((warehouse: WarehouseOption) => {
    setWarehouseInput(warehouse.name);
    setSelectedWarehouseRef(warehouse.ref);
    setSelectedWarehouseName(warehouse.name);
    setWarehouseOpen(false);
    setRemoteWarehouses([]);
    setNpError("");
  }, []);

  const loadWarehousesForSelectedCity = useCallback(async () => {
    if (!hasApiKey || !selectedCityRef || !deliveryMethod) return;

    const requestId = ++warehouseLoadIdRef.current;
    setLoadingWarehouses(true);
    setNpError("");

    try {
      const data = await fetchWarehousesForCity(
        NOVA_POSHTA_API_KEY,
        selectedCityRef,
        deliveryMethod,
        WAREHOUSE_LIST_LIMIT,
      );

      if (requestId !== warehouseLoadIdRef.current) return;

      const mapped = data.map(mapWarehouseItem);
      setAllWarehouses(mapped);
      setRemoteWarehouses([]);
      setWarehousesCacheKey(warehouseCacheKey);
    } catch (error) {
      if (requestId !== warehouseLoadIdRef.current) return;
      const message = error instanceof Error ? error.message : undefined;
      setNpError(
        message ??
          `Не вдалося завантажити ${activeDelivery?.pointLabel.toLowerCase() ?? "відділення"} Нової Пошти.`,
      );
      setAllWarehouses([]);
      setWarehousesCacheKey(warehouseCacheKey);
    } finally {
      if (requestId === warehouseLoadIdRef.current) {
        setLoadingWarehouses(false);
      }
    }
  }, [
    hasApiKey,
    selectedCityRef,
    deliveryMethod,
    warehouseCacheKey,
    activeDelivery?.pointLabel,
  ]);

  const openWarehouseDropdown = useCallback(() => {
    if (!hasApiKey || !selectedCityRef || !deliveryMethod) return;

    setWarehouseOpen(true);
    setNpError("");

    const needsLoad =
      warehousesCacheKey !== warehouseCacheKey ||
      (warehousesCacheKey === warehouseCacheKey && allWarehouses.length === 0);

    if (needsLoad) {
      void loadWarehousesForSelectedCity();
    }
  }, [
    hasApiKey,
    selectedCityRef,
    warehousesCacheKey,
    warehouseCacheKey,
    allWarehouses.length,
    loadWarehousesForSelectedCity,
  ]);

  const localFilteredWarehouses = useMemo(
    () => filterWarehousesLocal(allWarehouses, warehouseInput).slice(0, 50),
    [allWarehouses, warehouseInput],
  );

  const displayWarehouses = useMemo(() => {
    const q = warehouseInput.trim();

    if (
      warehouseOpen &&
      selectedWarehouseRef &&
      warehouseInput === selectedWarehouseName
    ) {
      return allWarehouses.slice(0, 50);
    }

    if (q.length > 0 && localFilteredWarehouses.length === 0 && remoteWarehouses.length > 0) {
      return remoteWarehouses.slice(0, 50);
    }

    return localFilteredWarehouses;
  }, [
    warehouseInput,
    warehouseOpen,
    selectedWarehouseRef,
    selectedWarehouseName,
    allWarehouses,
    localFilteredWarehouses,
    remoteWarehouses,
  ]);

  useEffect(() => {
    if (!warehouseOpen || !selectedCityRef || !hasApiKey || !deliveryMethod) return;

    const query = warehouseInput.trim();
    if (query.length < 1) {
      setRemoteWarehouses([]);
      setLoadingRemoteSearch(false);
      return;
    }

    if (localFilteredWarehouses.length > 0) {
      setRemoteWarehouses([]);
      setLoadingRemoteSearch(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setLoadingRemoteSearch(true);
        setNpError("");

        const data = await searchWarehouses(
          NOVA_POSHTA_API_KEY,
          selectedCityRef,
          deliveryMethod,
          query,
        );

        if (cancelled) return;

        setRemoteWarehouses(data.map(mapWarehouseItem));
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : undefined;
        setNpError(
          message ??
            `Не вдалося знайти ${activeDelivery?.pointLabel.toLowerCase() ?? "відділення"} Нової Пошти.`,
        );
        setRemoteWarehouses([]);
      } finally {
        if (!cancelled) setLoadingRemoteSearch(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    warehouseOpen,
    warehouseInput,
    selectedCityRef,
    deliveryMethod,
    hasApiKey,
    localFilteredWarehouses.length,
    activeDelivery?.pointLabel,
  ]);

  useEffect(() => {
    if (!warehouseOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!warehouseFieldRef.current?.contains(event.target as Node)) {
        setWarehouseOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [warehouseOpen]);

  useEffect(() => {
    if (!deliveryMethod || cityLocked) return;

    const query = cityQuery.trim();
    if (!hasApiKey || query.length < 2) {
      setCities([]);
      setShowCityList(false);
      setSelectedCityRef("");
      setSelectedCityName("");
      resetWarehouseSelection();
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoadingCities(true);
        setNpError("");

        const json = await callNovaPoshta<
          { Addresses: { DeliveryCity: string; Present: string }[] }[]
        >(NOVA_POSHTA_API_KEY, "Address", "searchSettlements", {
          CityName: query,
          Limit: 20,
        });

        if (!json?.success) {
          setNpError(
            formatNovaPoshtaError(json.errors) ??
              "Нова Пошта: не вдалося знайти міста. Перевірте API-ключ.",
          );
          setCities([]);
          setShowCityList(false);
          return;
        }

        const addresses = json?.data?.[0]?.Addresses ?? [];
        const mapped: CityOption[] = addresses.map((item) => ({
          ref: item.DeliveryCity,
          name: item.Present,
        }));
        setCities(mapped);
        setShowCityList(mapped.length > 0);

        if (mapped.length === 1) {
          applyCitySelection(mapped[0]);
        }
      } catch {
        setNpError("Не вдалося завантажити міста Нової Пошти.");
      } finally {
        setLoadingCities(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [
    cityQuery,
    hasApiKey,
    cityLocked,
    deliveryMethod,
    applyCitySelection,
    resetWarehouseSelection,
  ]);

  useEffect(() => {
    if (!selectedCityRef || !hasApiKey || !deliveryMethod) return;
    if (warehousesCacheKey === warehouseCacheKey) return;

    void loadWarehousesForSelectedCity();
  }, [
    selectedCityRef,
    warehouseCacheKey,
    hasApiKey,
    warehousesCacheKey,
    loadWarehousesForSelectedCity,
  ]);

  const handleCityInput = (value: string) => {
    setCityQuery(value);
    setCityLocked(false);
    setSelectedCityRef("");
    setSelectedCityName("");
    resetWarehouseSelection();
    setShowCityList(true);
  };

  const handleWarehouseInput = (value: string) => {
    setWarehouseInput(value);
    if (selectedWarehouseRef) {
      setSelectedWarehouseRef("");
      setSelectedWarehouseName("");
    }
    setRemoteWarehouses([]);
    setWarehouseOpen(true);
  };

  const handleCitySelect = (city: CityOption) => {
    applyCitySelection(city);
  };

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    resetCitySelection();
    setNpError("");
  };

  const handlePhoneChange = (value: string) => {
    setPhoneDigits(parseUaNationalPhoneDigits(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!showCheckout || !selectedColor) {
      setNpError("Спочатку оберіть бажаний колір.");
      return;
    }

    const name = customerName.trim();

    if (!name) {
      setNpError("Введіть ім’я.");
      return;
    }
    if (!isUaPhoneComplete(phoneDigits)) {
      setNpError("Введіть номер телефону: 9 цифр після +380 (без 0 на початку).");
      return;
    }
    if (!hasApiKey) {
      setNpError("API-ключ Нової Пошти не налаштований.");
      return;
    }
    if (!deliveryMethod) {
      setNpError("Оберіть спосіб отримання: відділення або поштомат.");
      return;
    }
    if (!selectedCityRef || !selectedWarehouseRef) {
      setNpError(
        `Оберіть місто та ${activeDelivery?.pointLabel.toLowerCase() ?? "відділення"} для доставки.`,
      );
      return;
    }
    setPaymentLoading(true);
    setNpError("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: selectedColor, name, phone: toUaE164(phoneDigits),
          city: selectedCityName, warehouse: selectedWarehouseName,
          deliveryMethod, comment: orderComment.trim(), contactRequested,
        }),
      });
      const invoice = await response.json();
      if (!response.ok) throw new Error(invoice.error ?? "Не вдалося створити замовлення.");
      window.location.assign(`/payment?order=${encodeURIComponent(invoice.id)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      setNpError(
        message ??
          "Не вдалося відкрити тестову оплату. Спробуйте пізніше.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const warehouseListBusy = loadingWarehouses || loadingRemoteSearch;

  return (
    <section id="contact" className="section-shell relative py-12 md:py-32">
      <span className="section-number">06</span>

      <div className="section-container">
        <Reveal>
          <SectionHeading line1="ОФОРМЛЕННЯ" line2="ЗАМОВЛЕННЯ" />
        </Reveal>

        <AnimatePresence mode="wait">
          {!showCheckout ? (
            <motion.div
              key="await-color"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={formStepTransition}
              className="cell-glass mt-6 rounded-xl p-8 text-center sm:mt-8 sm:rounded-[2rem] sm:p-10"
            >
              <p className="text-sm text-muted sm:text-base">
                Оберіть бажаний колір та продовжіть замовлення.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={formStepTransition}
            >
              {selectedColor ? (
                <p className="mt-4 text-sm text-muted sm:mt-6">
                  Обраний колір:{" "}
                  <span className="font-medium text-ink">
                    {selectedColor}
                  </span>
                </p>
              ) : null}

              <form
                onSubmit={handleSubmit}
                className="cell-glass mt-6 w-full rounded-xl p-5 sm:mt-8 sm:rounded-[2rem] sm:p-8 md:p-10"
              >
              <>
                {!hasApiKey ? (
                  <p className="mb-4 rounded-xl bg-amber-100/80 px-4 py-3 text-sm text-ink">
                    API-ключ Нової Пошти ще не підключений. Додайте його в налаштуваннях проєкту.
                  </p>
                ) : null}
                <p className="mb-4 rounded-xl bg-accent/30 px-4 py-3 text-sm">
                  Тестове оформлення. Реальні оплати та відправлення вимкнені.
                </p>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      Ім’я
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-2 w-full border-b border-ink/15 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink max-sm:text-base"
                      placeholder="Ваше ім’я"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone-national"
                      className="text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      Телефон
                    </label>
                    <div className="mt-2 flex items-center gap-2 border-b border-ink/15 focus-within:border-ink">
                      <span className="shrink-0 py-3 text-base font-medium text-ink">
                        {UA_PHONE_PREFIX}
                      </span>
                      <input
                        id="phone-national"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        required
                        value={formatUaNationalPhone(phoneDigits)}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none max-sm:text-base"
                        placeholder="50 123 45 67"
                        aria-describedby="phone-hint"
                      />
                    </div>
                    <p id="phone-hint" className="mt-2 text-xs text-muted">
                      Вводьте номер без 0 на початку — префікс {UA_PHONE_PREFIX} додається автоматично.
                    </p>
                  </div>

                  <fieldset disabled={!hasApiKey}>
                    <legend className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Спосіб отримання
                    </legend>
                    <div className="mt-3 space-y-3">
                      {deliveryMethodOptions.map((option) => {
                        const selected = deliveryMethod === option.id;
                        return (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 ${
                              selected
                                ? "border-ink bg-ink/5 shadow-soft"
                                : "border-ink/15 bg-card/30 hover:border-ink/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value={option.id}
                              checked={selected}
                              onChange={() => handleDeliveryMethodChange(option.id)}
                              className="h-4 w-4 shrink-0 accent-ink"
                            />
                            <NovaPoshtaLogo className="h-9 w-9 shrink-0" />
                            <span className="font-display text-sm font-bold sm:text-base">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <FormStep show={showCityStep}>
                    <div className="relative">
                      <label
                        htmlFor="city"
                        className="text-xs font-semibold uppercase tracking-wider text-muted"
                      >
                        Місто
                      </label>
                      <input
                        id="city"
                        required={showCityStep}
                        autoComplete="off"
                        value={cityQuery}
                        onChange={(e) => handleCityInput(e.target.value)}
                        onFocus={() => cities.length > 0 && setShowCityList(true)}
                        disabled={!hasApiKey}
                        className="mt-2 w-full border-b border-ink/15 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="Почніть вводити місто (мін. 2 літери)..."
                      />
                      {loadingCities ? (
                        <p className="mt-2 text-xs text-muted">Шукаємо міста...</p>
                      ) : null}
                      {showCityList && cities.length > 0 ? (
                        <ul
                          role="listbox"
                          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-2xl border border-ink/10 bg-card py-1 shadow-card"
                        >
                          {cities.map((city) => (
                            <li key={city.ref}>
                              <button
                                type="button"
                                role="option"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleCitySelect(city)}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/40 ${
                                  selectedCityRef === city.ref ? "bg-accent/30 font-semibold" : ""
                                }`}
                              >
                                {city.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {!loadingCities &&
                      cityQuery.trim().length >= 2 &&
                      cities.length === 0 &&
                      hasApiKey ? (
                        <p className="mt-2 text-xs text-muted">
                          Місто не знайдено. Спробуйте інший запит.
                        </p>
                      ) : null}
                      {selectedCityName ? (
                        <p className="mt-2 text-xs text-muted">Обрано: {selectedCityName}</p>
                      ) : (
                        <p className="mt-2 text-xs text-muted">Оберіть місто зі списку.</p>
                      )}
                    </div>
                  </FormStep>

                  <FormStep show={showWarehouseStep}>
                    <div ref={warehouseFieldRef} className="relative">
                      <label
                        htmlFor="warehouse"
                        className="text-xs font-semibold uppercase tracking-wider text-muted"
                      >
                        {activeDelivery?.pointLabel}
                      </label>
                      <input
                        id="warehouse"
                        type="text"
                        required={showWarehouseStep}
                        autoComplete="off"
                        value={warehouseInput}
                        onChange={(e) => handleWarehouseInput(e.target.value)}
                        onFocus={openWarehouseDropdown}
                        onClick={openWarehouseDropdown}
                        disabled={!hasApiKey}
                        className="mt-2 w-full border-b border-ink/15 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="Натисніть для списку або введіть номер..."
                      />
                      {warehouseListBusy ? (
                        <p className="mt-2 text-xs text-muted">
                          {loadingWarehouses
                            ? `Завантажуємо ${activeDelivery?.pointLabel.toLowerCase()}...`
                            : "Уточнюємо пошук..."}
                        </p>
                      ) : null}
                      {warehouseOpen && selectedCityRef ? (
                        <ul
                          role="listbox"
                          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-2xl border border-ink/10 bg-card py-1 shadow-card"
                        >
                          {warehouseListBusy && displayWarehouses.length === 0 ? (
                            <li className="px-4 py-2.5 text-sm text-muted">Завантаження...</li>
                          ) : null}
                          {!warehouseListBusy &&
                          displayWarehouses.length === 0 &&
                          warehouseInput.trim().length > 0 ? (
                            <li className="px-4 py-2.5 text-sm text-muted">
                              {activeDelivery?.pointLabel} не знайдено. Спробуйте інший номер.
                            </li>
                          ) : null}
                          {!warehouseListBusy &&
                          displayWarehouses.length === 0 &&
                          warehouseInput.trim().length === 0 &&
                          allWarehouses.length === 0 ? (
                            <li className="px-4 py-2.5 text-sm text-muted">
                              Немає {activeDelivery?.pointLabel.toLowerCase()} у цьому місті.
                            </li>
                          ) : null}
                          {displayWarehouses.map((warehouse) => (
                            <li key={warehouse.ref}>
                              <button
                                type="button"
                                role="option"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyWarehouseSelection(warehouse);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/40 ${
                                  selectedWarehouseRef === warehouse.ref
                                    ? "bg-accent/30 font-semibold"
                                    : ""
                                }`}
                              >
                                {warehouse.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {!selectedWarehouseRef ? (
                        <p className="mt-2 text-xs text-muted">
                          Натисніть поле — з&apos;явиться список. Введіть номер, щоб звузити пошук.
                        </p>
                      ) : null}
                    </div>
                  </FormStep>

                  <FormStep show={showCommentStep}>
                    <div>
                      <label
                        htmlFor="comment"
                        className="text-xs font-semibold uppercase tracking-wider text-muted"
                      >
                        Коментар до замовлення
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        value={orderComment}
                        onChange={(e) => setOrderComment(e.target.value)}
                        className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink"
                        placeholder="Наприклад: зручний час для дзвінка"
                      />
                    </div>
                    <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3">
                      <span className="text-sm font-medium">Зв’язатися зі мною</span>
                      <span className="relative inline-flex shrink-0">
                        <input type="checkbox" role="switch" checked={contactRequested} onChange={(event) => setContactRequested(event.target.checked)} className="peer sr-only" />
                        <span className="h-7 w-12 rounded-full bg-ink/15 transition-colors peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink" />
                        <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-ink transition-transform peer-checked:translate-x-5" />
                      </span>
                    </label>

                      <div className="mt-8">
                        <p className="mb-3 text-sm text-muted">
                          Сума до сплати:{" "}
                          <span className="font-semibold text-ink">
                            {orderAmountUah.toLocaleString("uk-UA")} ₴
                          </span>
                        </p>
                        <MagneticButton
                          type="submit"
                          disabled={paymentLoading}
                          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-sm font-semibold uppercase tracking-wider text-surface disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                        >
                          {paymentLoading ? "Підготовка оплати…" : "Перейти до тестової оплати"}
                          <DoodleIcon type="arrow" className="h-4 w-4" />
                        </MagneticButton>
                      </div>
                  </FormStep>
                </div>
                {npError ? <p className="mt-4 text-sm text-red-500">{npError}</p> : null}
              </>
              </form>


            </motion.div>
          )}
        </AnimatePresence>

        <Reveal delay={0.25}>
          <div className="contact-footer mt-20 border-t border-border pt-16">
            <div className="cell-glass w-full rounded-3xl p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold md:text-3xl">Контакти</h3>
              <ul className="mt-6 space-y-3 text-sm md:text-base">
                <li>
                  <a
                    href="https://t.me/chabaniuk_vladyslav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animated-underline inline-flex max-w-full items-center gap-2 hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
                      <path d="M21.94 4.67 18.72 19.8c-.24 1.07-.88 1.33-1.78.83l-4.9-3.61-2.36 2.28c-.26.26-.48.48-.98.48l.35-4.98 9.07-8.2c.39-.35-.09-.55-.6-.2L6.31 13.46 1.48 11.95c-1.05-.33-1.07-1.05.22-1.55L20.59 3.12c.88-.33 1.65.2 1.35 1.55Z" />
                    </svg>
                    <span className="min-w-0 break-all">@chabaniuk_vladyslav</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+380632517574" className="animated-underline hover:text-ink">
                    +38 (063) 251-75-74
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
