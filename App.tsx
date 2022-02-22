import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = "a0d272a3530a460b928df98cfab72a24";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState<any>("");
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setsearchResults] = useState<any[]>([]);

  useEffect(() => {
    const hash: any = window.location.hash;
    let token: any = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem: string) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const search = async (e: any) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "track",
      },
    });

    setsearchResults(data.tracks.items);
    console.log(data.tracks.items);
  };

  // const download = (e: any) => {}

  const renderResults = () => {
    return searchResults.map((data) => (
      <div
        className="p-4 m-4 mx-auto bg-white max-w-xl flex items-center rounded-xl"
        key={data.id}
      >
        {data.album.images.length ? (
          <img
            className="block h-32 rounded-xl"
            src={data.album.images[0].url}
            alt=""
          />
        ) : (
          <div>No Image</div>
        )}
        <div className="grow p-4">
          <p className="">Song: {data.name}</p>
          <p className="">Album: {data.album.name}</p>
          <p className="">Artist: {data.album.artists[0].name}</p>
        </div>
        <button className="p-4 hover:text-cyan-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    ));
  };

  return (
    <div className="m-4">
      <h1 className="">
      </h1>
      {!token ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
          }}
        >
          {" "}
          Click here
        </button>
      ) : (
        <form className="flex mx-auto max-w-xl" onSubmit={search}>
          <input
            className="grow rounded-xl p-2"
            placeholder="Enter a song title..."
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="ml-2" type={"submit"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      )}
      {renderResults()}
    </div>
  );
}

export default App;
