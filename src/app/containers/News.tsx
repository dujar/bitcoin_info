import { useState } from "react";
import { Scrollable } from "../../components/styled/Scrollable";
import { ECrypto, ECurrency, ESpan } from "../../types";
import { useBitcoin } from "../../service/bitcoin";
import moment from "moment";

interface Props {
  display: boolean;
}

export const BitcoinNews = (props: Props) => {
  const bitcoin = useBitcoin();

  return (
    <div
      style={{
        padding: "2px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
      {props.display ? (
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
                      {news.children.find((n) => n.name === "title")?.value && (
                        <a
                          href={
                            news.children.find((n) => n.name === "link")?.value
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
      ) : null}
    </div>
  );
};
