import "dotenv/config";
import logo from "./logo.svg";
import "./App.css";

import React from "react";
import { FileInput as NewFileInput } from "@8base/file-manager";

import { useQuery, gql } from "@apollo/client";

const FILMS_QUERY = gql`
  query filesList {
    filesList {
      count
      items {
        id
        fileId
        filename
        meta
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(FILMS_QUERY);

  const handleClickModal = (openModal) => {
    console.log("clicked");
    openModal();
  };

  if (loading)
    return (
      <div className="App">
        <header className="App-header">
          <h1>Loading...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );

  if (error)
    return (
      <div className="App">
        <header className="App-header">
          <pre>{error.message}</pre>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );

  return (
    <div className="App">
      <header className="App-header">
        <h1>File manager</h1>

        <NewFileInput
          apiKey={process.env.REACT_APP_API_TOKEN}
          onChange={(file) => console.log(file)}
          useFilestack={true}
          maxFiles={2}
          value={null}
          workspace={process.env.REACT_APP_WORKSPACE}
          environment={process.env.REACT_APP_ENV}
          uploadHost={`https://qa4-file-manager.8basedev.com`}
        >
          {({ openModal }) => (
            <>
              <button
                className="App-button"
                onClick={() => handleClickModal(openModal)}
              >
                Button to Load
              </button>
            </>
          )}
        </NewFileInput>

        <img src={logo} className="App-logo" alt="logo" />
        <h3>filesList - count: {data.filesList.count}</h3>
        <ul className="App-ul">
          {data.filesList.items.map((file, index) => (
            <>
              <li key={index + "id"}>
                {file.fileId}
              </li>
              <li key={index + "name"}>
                {file.filename}
              </li>
            </>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
