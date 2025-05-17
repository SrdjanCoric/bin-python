import { useState } from "react";

const Request = ({ data }) => {
  const [visibility, setVisibility] = useState({
    headers: "hidden",
    body: "hidden",
    queryParams: "hidden",
  });

  const toggleVisibility = (prop) => {
    const newStatus = visibility[prop] === "visible" ? "hidden" : "visible";

    setVisibility({
      ...visibility,
      [prop]: newStatus,
    });
  };

  return (
    <li>
      <dl className={data.method.toLowerCase()}>
        <div className="left-request-info">
          <Method data={data.method} />
          <TimeStamp data={data.timestamp} />
        </div>
        <div className="right-request-info">
          <Path data={data.path} />
          <Headers
            data={data.headers}
            visibility={visibility}
            toggleVisibility={toggleVisibility}
          />
          <Body
            data={data.body}
            visibility={visibility}
            toggleVisibility={toggleVisibility}
          />
          <QueryParams
            data={data.query_params}
            visibility={visibility}
            toggleVisibility={toggleVisibility}
          />
        </div>
      </dl>
    </li>
  );
};

const Method = ({ data }) => {
  return <dt className="method">[{data}]</dt>;
};

const TimeStamp = ({ data }) => {
  const [date, time] = [data.slice(0, 10), data.slice(11, 19)];

  return (
    <>
      <dt className="time">
        <img id="clock" src="/src/assets/clock.svg" /> {time}
      </dt>
      <dt className="date">
        <img id="calendar" src="/src/assets/calendar.svg" /> {date}
      </dt>
    </>
  );
};

const Path = ({ data }) => {
  return <dt className="path">{data}</dt>;
};

const Headers = ({ data, visibility, toggleVisibility }) => {
  return (
    <dt>
      <button type="button" onClick={() => toggleVisibility("headers")}>
        Headers
      </button>
      <pre className={visibility.headers}>
        <ul>
          {Object.entries(data).map((pair, idx) => (
            <li key={idx}>
              {pair[0]}: {String(pair[1])}
            </li>
          ))}
        </ul>
      </pre>
    </dt>
  );
};

const Body = ({ data, visibility, toggleVisibility }) => {
  if (data) {
    return (
      <dt>
        <button type="button" onClick={() => toggleVisibility("body")}>
          Body
        </button>
        <pre className={visibility.body}>{JSON.stringify(data)}</pre>
      </dt>
    );
  }
};

const QueryParams = ({ data, visibility, toggleVisibility }) => {
  if (Object.values(data).length) {
    return (
      <dt>
        <button type="button" onClick={() => toggleVisibility("queryParams")}>
          Query Parameters
        </button>
        <pre className={visibility.queryParams}>
          <ul>
            {Object.entries(data).map((pair, idx) => (
              <li key={idx}>
                {pair[0]}: {String(pair[1])}
              </li>
            ))}
          </ul>
        </pre>
      </dt>
    );
  }
};

export default Request;
