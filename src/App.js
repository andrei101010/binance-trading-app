import "./App.css";
import axios from "axios";
import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import GridLoader from "react-spinners/ClipLoader";

export const ChartComponent = (props) => {
  const { data, sma } = props;
  const chartContainerRef = useRef();
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      width: chartContainerRef.current.clientWidth - 50,
      height: 400,
    });
    let data1 = [];
    for(let i = 0; i < data.length; i ++){
      let tmp = {};
      if(i < sma - 1){
        tmp = {time : data[i].time, value: data[i].open};
        data1.push(tmp);
      }
      else{
        let sum = 0;
        for(let j = i - sma + 1; j <= i ; j ++) sum += data[j].open;
        sum /= sma;
        tmp = {time : data[i].time, value: sum};
        data1.push(tmp);
      }
    }
    console.log(data1);
    const areaSeries = chart.addLineSeries();
    areaSeries.setData(data1);
    //     { time: 1571210040, value: 32.51 },
    //     { time: 1571210100, value: 31.11 },
    //     { time: 1571210160, value: 27.02 },
    //     { time: 1571210220, value: 27.32 },
    //     { time: 1571210280, value: 25.17 },
    //     { time: 1571210340, value: 28.89 },
    //     { time: 1571210400, value: 25.46 },
    //     { time: 1571210460, value: 23.92 },
    //     { time: 1571210520, value: 22.68 },
    //     { time: 1571210580, value: 22.67 },
    // ]);

    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(data);
    chart.timeScale().fitContent();
    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div className="d-flex justify-content-center" ref={chartContainerRef} />
  );
};

export function App(props) {
  const interval = useRef(-1);
  const [data, setData] = useState([]);
  const [current_symbol, setCurrent_symbol] = useState("BTCUSDT");
  const [current_timeframe, setCurrent_timeframe] = useState("1m");
  const [symbols, setSymbols] = useState([]);
  const [sma, setSma] = useState(1);
  const timeframes = [
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "8h",
    "12h",
    "15h",
    "1d",
    "1w",
    "1m",
  ];
  const smas = [1, 2, 3, 4, 5, 6];
  useEffect(() => {
    axios
      .get("https://api.binance.com/api/v1/exchangeInfo")
      .then((result) => result.data.symbols)
      .then((result) => {
        const tmp = [];
        for (let item of result) tmp.push(item.symbol);
        setSymbols(tmp);
      });
  }, []);
  useEffect(() => {
    interval.current = setInterval(() => {
      axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=" +
            current_symbol +
            "&interval=" +
            current_timeframe +
            "&limit=100"
        )
        .then((result) => result.data)
        .then((result) => {
          const tmp_data = [];
          for (let item of result) {
            let tmp = {
              time: item[0] / 1000,
              open: parseFloat(item[1]),
              high: parseFloat(item[2]),
              low: parseFloat(item[3]),
              close: parseFloat(item[4]),
            };
            tmp_data.push(tmp);
          }
          setData(tmp_data);
        });
    }, 1000);
    return () => clearInterval(interval.current);
  }, [current_symbol, sma, current_timeframe]);

  return (
    <div className="row text-center p-3">
      <div className="d-flex justify-content-around">
        <div className="form-group d-flex align-items-center">
          <label className="p-2" for="">
            Symbol
          </label>
          <select
            className="form-control"
            name="symbols"
            id="symbols"
            onChange={(e) => setCurrent_symbol(e.target.value)}
          >
            {symbols.map((symbol, index) => (
              <option key={index} className="form-control" value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group d-flex align-items-center">
          <label className="p-2" for="">
            Timeframe
          </label>
          <select
            className="form-control"
            name="cars"
            id="cars"
            onChange={(e) => setCurrent_timeframe(e.target.value)}
          >
            {timeframes.map((timeframe, index) => (
              <option key={index} className="form-control" value={timeframe}>
                {timeframe}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group d-flex align-items-center">
          <label className="p-2" for="">
            SMA
          </label>
          <select className="form-control" name="cars" id="cars" onChange={e => setSma(e.target.value)}>
            {smas.map((sma, index) => (
              <option key={index} className="form-control" value={sma}>
                {sma}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group d-flex align-items-center">
          <label className="p-2" for="">
            Buy
          </label>
          <select className="form-control" name="cars" id="cars">
            <option className="form-control" value="volvo">
              Open
            </option>
            <option className="form-control" value="volvo">
              Close
            </option>
            <option className="form-control" value="volvo">
              High
            </option>
            <option className="form-control" value="volvo">
              Low
            </option>
          </select>
        </div>
        <div className="form-group d-flex align-items-center">
          <label className="p-2" for="">
            Quantity
          </label>
          <select className="form-control" name="cars" id="cars">
            <option className="form-control" value="volvo">
              2%
            </option>
            <option className="form-control" value="volvo">
              3%
            </option>
            <option className="form-control" value="volvo">
              4%
            </option>
            <option className="form-control" value="volvo">
              5%
            </option>
          </select>
        </div>
      </div>
      <div className="p-2 d-flex flex-column justify-content-center">
        <h1 className="pt-2 text-info">{current_symbol}</h1>
        {data.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}><GridLoader size={100} color="#36d7b7" /></div>
        ) : (
          <ChartComponent
            className="pt-2"
            data={data}
            symbol={current_symbol}
            sma={sma}
          />
        )}
      </div>
      <div className=" pt-2 d-flex  justify-content-around">
        <button className="btn btn-lg btn-primary">START</button>
        <button className="btn btn-lg btn-danger disabled">STOP</button>
      </div>
    </div>
  );
}