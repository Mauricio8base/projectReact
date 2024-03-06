import "dotenv/config";
import logo from "./logo.svg";
import "./App.css";

import React, { useState } from "react";
import { FileInput as NewFileInput } from "@8base/file-manager";

import { useQuery, gql, useMutation } from "@apollo/client";

const FILE_LIST_QUERY = gql`
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

const MY_MUTATION = gql`
  mutation Table_01Create($input: Table_01CreateInput!) {
    table_01Create(data: $input) {
      id
      name
      file_image {
        id
        fileId
        filename
        downloadUrl
        shareUrl
        meta
        public
      }
      file_image_mult {
        items {
          id
          fileId
          filename
          downloadUrl
          shareUrl
          meta
          public
        }
        count
      }
      file_file {
        id
        fileId
        filename
        downloadUrl
        shareUrl
        meta
        public
      }
      file_file_mult {
        items {
          id
          fileId
          filename
          downloadUrl
          shareUrl
          meta
          public
        }
        count
      }
    }
  }
`;

function App() {
  const [createRow, { dataCreate }] = useMutation(MY_MUTATION);
  const handleCreateRow = () => {
    createRow({
      variables: {
        input: {
          name: "TestFromReactApp",
          file_image: {
            create: {
              fileId: fileId,
              filename: nameFile,
              public: false,
            },
          },
        },
      },
    });
  };

  const { data, loading, error } = useQuery(FILE_LIST_QUERY);

  const handleClickModal = (openModal) => {
    console.log("clicked");
    openModal();
  };

  const [nameFile, setnameFile] = useState("Name file..");
  const [fileId, setfileId] = useState(null);

  const handleGetResponse = (file) => {
    if (file.length > 0){
      setnameFile(file[0].filename);
      setfileId(file[0].fileId);
    }
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

  if (dataCreate) console.log("dataCreate: " + dataCreate);

  return (
    <div className="App">
      <header className="App-header">
        <h1>File manager</h1>

        <label>Name:</label>
        <br></br>
        <input type="text" placeholder="Name.."></input>
        <br></br>
        <NewFileInput
          apiKey={process.env.REACT_APP_API_TOKEN}
          onChange={handleGetResponse}
          //onChange={(file) => console.log("Data: " + file[0].fileId)}
          useFilestack={false}
          maxFiles={2}
          value={null}
          workspace={process.env.REACT_APP_WORKSPACE}
          environment={process.env.REACT_APP_ENV}
          error={(error) => console.log("Error from error: " + error)}
          uploadHost={process.env.REACT_APP_UPLOADHOST}
        >
          {({ pick }) => (
            <>
              <button
                className="App-button"
                onClick={() => handleClickModal(pick)}
              >
                Button Text
              </button>
            </>
          )}
        </NewFileInput>
        <br></br>
        <input type="text" value={nameFile} readOnly></input>
        <br></br>
        <button className="App-button" onClick={handleCreateRow}>
          Add Row
        </button>
        <br></br>

        <img src={logo} className="App-logo" alt="logo" />
        <h3>filesList - count: {data.filesList.count}</h3>
        <ul className="App-ul">
          {data.filesList.items.map((file, index) => (
            <>
              <li key={index + "id"}>{file.fileId}</li>
              <li key={index + "name"}>{file.filename}</li>
            </>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
