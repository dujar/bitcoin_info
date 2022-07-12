import React, { useCallback, useEffect, useState } from "react";
import { useService } from "./service";
import { Chart } from "./components";
import { Centered } from "./components/styled/Centered";
import { ECrypto, ESpan, ECurrency } from "./types";
import { Scrollable } from "./components/styled/Scrollable";
import moment from "moment";

function App() {
  const { bitcoin } = useService();
  const [span, setSpan] = useState<ESpan>(ESpan.ALL);
  const [currency, setCurrency] = useState(ECurrency.USD);
  const [base, setBase] = useState(ECrypto.BCH);
  const [display, setDisplay] = useState<"charts" | "news">("news");

  useEffect(() => {
    if (ESpan.DAY !== span) {
      setCurrency(ECurrency.USD);
      bitcoin.getHistoricalFeed(span, ECurrency.USD, base);
    } else {
      bitcoin.getLatestFeed(currency, base);
    }
  }, [span, base, currency]);

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
  return (
    <div>
      <select
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
        value={display}
        onChange={(e) => {
          e.preventDefault();
          setDisplay(e.target.value as "news" | "charts");
        }}>
        <option value='news'>News</option>
        <option value='charts'>Charts</option>
      </select>
      {display === "charts" && (
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
      )}
      <br />
      <div
        style={{
          padding: "2px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
        {display === "news" && (
          <Scrollable scrollY width='80%' height='400px'>
            {bitcoin.news &&
              bitcoin.news.children &&
              bitcoin.news.children[0].children
                .filter((news) => {
                  return news.name === "item";
                })
                .sort((a, b) => {
                  const timeB = moment(
                    b.children.find((e) => e.name === "pubDate")?.value
                  );
                  const timeA = moment(
                    a.children.find((e) => e.name === "pubDate")?.value
                  );
                  if (timeA && timeB) {
                    return timeA.unix() - timeB.unix();
                  }
                  return -1;
                })
                .slice(0, 4)
                .map((news, i) => {
                  return (
                    <div key={news.children[0].name + i}>
                      <hr />
                      <h2 style={{ color: "black", fontWeight: "bold" }}>
                        {news.children.find((n) => n.name === "title")
                          ?.value && (
                          <a
                            href={
                              news.children.find((n) => n.name === "link")
                                ?.value
                            }
                            dangerouslySetInnerHTML={{
                              __html:
                                news.children.find((n) => n.name === "title")
                                  ?.value || "",
                            }}
                            target='_blank'
                            rel='noreferrer'
                          />
                        )}
                      </h2>
                      <div
                        style={
                          {
                            // backgroundColor: "grey",
                          }
                        }
                        dangerouslySetInnerHTML={{
                          __html:
                            news.children.find(
                              (item) => item.name === "content:encoded"
                            )?.value || "",
                        }}
                      />
                    </div>
                  );
                })}
          </Scrollable>
        )}
      </div>
    </div>
  );
}

export default () => (
  <Centered>
    <App />
  </Centered>
);
