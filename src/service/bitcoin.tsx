import axios, { AxiosInstance } from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ECrypto, ESpan, ECurrency, IFeed } from "../types";
// @ts-ignore
// const { convertXML } = require("simple-xml-to-json");
import XMLParser from "react-xml-parser";
import { newsXML } from "./news";
import { INewsResponse } from "../types/index";

const newsClient = axios.create({
  baseURL: "https://news.bitcoin.com/feed/",
});

const feedClient = axios.create({
  baseURL: "https://index-api.bitcoin.com/api/v0/",
});

export const useBitcoin = () => {
  const [news, setNews] = useState<INewsResponse>({} as INewsResponse);
  const [feed, setFeed] = useState<IFeed[]>([]);
  const [base, setBase] = useState(ECrypto.BCH);
  const [price, setPrice] = useState(ECurrency.USD);
  const [historicalFeed, setHistoricalFeed] = useState<IFeed[]>([]);

  const getAllFeed = useCallback(async (crypto: ECrypto): Promise<IFeed[]> => {
    return feedClient
      .get<[string, string][]>(crypto + "/history")
      .then((resp) => {
        const data = resp.data;

        const values = data.map((item) => {
          return {
            time: moment(item[0]).format("DD/MM/YY"),
            feed: Number(item[1]),
            base,
            price,
          };
        });
        setHistoricalFeed(values);
        return values;
      });
  }, []);

  useEffect(() => {
    getAllFeed(base).then(setFeed);
  }, []);

  const getPrice = (p?: ECurrency) => {
    if (!p) {
      return price;
    }
    setPrice(p);
    return p;
  };

  const getBase = (p?: ECrypto) => {
    if (!p) {
      return base;
    }
    setBase(p);
    return p;
  };
  const getLatestNews = async () => {
    const resp = await newsClient.get("", {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });

    return resp.data;
  };
  useEffect(() => {
    getLatestNews().then(async (data) => {
      const parsedNews = new XMLParser().parseFromString(data);
      setNews(parsedNews);
    });
  }, []);

  const getLatestFeed = async (currency: ECurrency, crypto?: ECrypto) => {
    const resp = await feedClient.get(
      getBase(crypto) + "/" + "price" + "/" + getPrice(currency)
    );
    setFeed([
      {
        time: moment.unix(resp.data.stamp).format("DD/MM/YY"),
        feed: resp.data.price,
        base: getBase(crypto),
        price: getPrice(currency),
      },
    ]);
    return [resp.data];
  };

  const getHistoricalFeed = async (
    span: ESpan,
    currency = ECurrency.USD,
    crypto = ECrypto.BCH
  ) => {
    let data = historicalFeed;
    if (crypto !== base) {
      data = await getAllFeed(crypto);
      setFeed(data);
      setBase(crypto);
    }
    if (currency !== price) {
      setPrice(currency);
    }
    let demandedFeed = data;
    if (data && data.length > 0) {
      switch (span) {
        case ESpan.WEEK: {
          demandedFeed = data.filter((h) => {
            const days = moment().diff(moment(h.time), "days");
            return days < 7;
          });

          break;
        }
        case ESpan.MONTH: {
          demandedFeed = data.filter((h) => {
            const days = moment().diff(moment(h.time), "days");
            return days < 30;
          });
          break;
        }
        case ESpan.DAY: {
          demandedFeed = data.filter((h) => {
            const days = moment().diff(moment(h.time), "days");
            return days == 0;
          });
          break;
        }
        case ESpan.ALL: {
          demandedFeed = data;
          break;
        }
        default:
      }
    }

    setFeed(demandedFeed);
  };

  return {
    news,
    feed,
    getLatestFeed,
    getHistoricalFeed,
    getLatestNews,
  };
};
