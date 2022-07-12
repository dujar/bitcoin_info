import React, { useCallback, useEffect, useState } from "react";
import { Chart } from "../../components";
import { ECrypto, ECurrency, ESpan } from "../../types";
import { useService } from "../../service/index";

interface Props {
  display: boolean;
}

export const BitcoinChart = (props: Props) => {
  const { bitcoin } = useService();
  const [span, setSpan] = useState<ESpan>(ESpan.ALL);
  const [currency, setCurrency] = useState(ECurrency.USD);
  const [base, setBase] = useState(ECrypto.BCH);

  const renderBaseOptions = useCallback(() => {
    let options = [];
    for (let op in ECrypto) {
      options.push(op);
    }
    return options.map((b) => {
      return (
        <option key={b} value={(ECrypto as any)[b]}>
          {b}
        </option>
      );
    });
  }, []);

  useEffect(() => {
    if (ESpan.DAY !== span) {
      setCurrency(ECurrency.USD);
      bitcoin.getHistoricalFeed(span, ECurrency.USD, base);
    } else {
      bitcoin.getLatestFeed(currency, base);
    }
  }, [span, base, currency]);

  return props.display ? (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <select
          disabled={span !== ESpan.DAY}
          value={currency}
          onChange={(e) => {
            e.preventDefault();
            setCurrency(e.target.value as ECurrency);
          }}>
          {Object.values(ECurrency).map((b) => {
            return (
              <option key={b} value={b}>
                {b}
              </option>
            );
          })}
        </select>
        <select
          value={span}
          onChange={(e) => {
            e.preventDefault();
            setSpan(e.target.value as ESpan);
          }}>
          <option value={ESpan.ALL}>All</option>
          <option value={ESpan.WEEK}>7 days</option>
          <option value={ESpan.MONTH}>1 month</option>
          <option value={ESpan.DAY}>24 hours</option>
        </select>
        <select
          value={base}
          onChange={(e) => {
            e.preventDefault();
            setBase(e.target.value as ECrypto);
          }}>
          {renderBaseOptions()}
        </select>
      </div>

      <Chart
        meta={{
          span,
          keyX: "time",
          keyY: "feed",
          data: bitcoin.feed,
        }}
      />
    </>
  ) : null;
};
