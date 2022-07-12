import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useReducer } from "react";
import { ECrypto, ESpan, ECurrency, IFeed } from "../types";
// @ts-ignore
import XMLParser from "react-xml-parser";
import { IState } from "../types/index";

const newsClient = axios.create({
  baseURL: "https://news.bitcoin.com/feed/",
});

const feedClient = axios.create({
  baseURL: "https://index-api.bitcoin.com/api/v0/",
});

const reducer = (
  state: IState,
  action: {
    type: "news" | "feed" | "crypto" | "currency" | "historicalFeed";
    payload: any;
  }
): IState => {
  switch (action.type) {
    case "news": {
      return { ...state, news: action.payload };
    }
    case "feed": {
      return { ...state, feed: action.payload };
    }
    case "crypto": {
      return { ...state, base: action.payload };
    }
    case "currency": {
      return { ...state, price: action.payload };
    }
    case "historicalFeed": {
      return { ...state, historicalFeed: action.payload };
    }
    default: {
      return state;
    }
  }
};
export const useBitcoin = () => {
  const [state, dispatch] = useReducer(reducer, {
    base: ECrypto.BCH,
    price: ECurrency.USD,
  } as IState);

  const getAllFeed = useCallback(async (crypto: ECrypto): Promise<IFeed[]> => {
    return feedClient
      .get<[string, string][]>(crypto + "/history")
      .then((resp) => {
        const data = resp.data;

        const values = data.map((item) => {
          return {
            time: moment(item[0]).format("DD/MM/YY"),
            feed: Number(item[1]),
            base: state.base,
            price: state.price,
          };
        });
        dispatch({ type: "historicalFeed", payload: values });
        return values;
      });
  }, []);

  useEffect(() => {
    getAllFeed(state.base).then((p) => {
      dispatch({ type: "feed", payload: p });
    });
  }, []);

  const getPrice = (p?: ECurrency) => {
    if (!p) {
      return state.price;
    }
    dispatch({ type: "currency", payload: p });
    return p;
  };

  const getBase = (p?: ECrypto) => {
    if (!p) {
      return state.base;
    }
    dispatch({ type: "crypto", payload: p });
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
      dispatch({ type: "news", payload: parsedNews });
    });
  }, []);

  const getLatestFeed = async (currency: ECurrency, crypto?: ECrypto) => {
    const resp = await feedClient.get(
      getBase(crypto) + "/" + "price" + "/" + getPrice(currency)
    );

    const payload = [
      {
        time: moment.unix(resp.data.stamp).format("DD/MM/YY"),
        feed: resp.data.price,
        base: getBase(crypto),
        price: getPrice(currency),
      },
    ];
    dispatch({ type: "feed", payload });
    return payload;
  };

  const getHistoricalFeed = async (
    span: ESpan,
    currency = ECurrency.USD,
    crypto = ECrypto.BCH
  ) => {
    let data = state.historicalFeed;
    if (crypto !== state.base) {
      data = await getAllFeed(crypto);
      dispatch({ type: "feed", payload: data });
      dispatch({ type: "crypto", payload: crypto });
    }
    if (currency !== state.price) {
      dispatch({ type: "currency", payload: currency });
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

    dispatch({ type: "feed", payload: demandedFeed });
  };

  return {
    news: state.news,
    feed: state.feed,
    getLatestFeed,
    getHistoricalFeed,
    getLatestNews,
  };
};
