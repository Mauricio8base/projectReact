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
        downloadUrl
      }
    }
  }
`;

const FILE_LIST_SETTINGS = gql`
  query filesSettingsList {
  filesSettingsList {
    count
    items {
      id
      filemanagername
      settings
    }
  }
}
`;

const MUTATION_CREATE_RECORD = gql`
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
  const { data: dataSettings, loading: loadingSettings, error: errorSettings } = useQuery(FILE_LIST_SETTINGS);
  const { data, loading, error, refetch } = useQuery(FILE_LIST_QUERY);
  const [createRow, { dataCreate }] = useMutation(MUTATION_CREATE_RECORD);
  const handleCreateRow = () => {
    createRow({
      variables: {
        input: {
          name: nameRecord + " from React",
          file_image: {
            create: {
              fileId: fileId,
              filename: nameFile,
              public: false,
            },
          },
        },
      },
    }).then(() => { 
      refetch();
    });
  };

  const handleClickModal = (openModal) => {
    console.log("clicked");
    openModal();
  };

  const [nameRecord, setNameRecord] = useState('Name Test');

  const handleNameRecord = (event) => {
    setNameRecord(event.target.value);
  };

  const [nameFile, setnameFile] = useState('Name File');
  const [fileId, setfileId] = useState(null);

  const handleGetResponse = (file) => {
    if (file && file.length > 0) {
      setnameFile(file[0].filename);
      setfileId(file[0].fileId);
    }
  };

  if (loading)
    return (
      <div className="App">
        <header className="App-header">
          <h1>Loading File List...</h1>
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
  
  if (loadingSettings)
    return (
      <div className="App">
        <header className="App-header">
          <h1>Loading File Settings...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );

  if (errorSettings)
    return (
      <div className="App">
        <header className="App-header">
          <pre>{errorSettings.message}</pre>
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
        <input type="text" placeholder="Name.." value={nameRecord} onChange={handleNameRecord}></input>
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
          errorCallback={(error) => console.log("Error from error: " + error)}
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

        <h3>Files List - count: {data.filesList.count}</h3>
          {data.filesList.count > 0 && (
            <table className="App-table">
              <thead>
                <tr>
                  <th>File ID</th>
                  <th>File Name</th>
                  <th>downloadUrl</th>
                </tr>
              </thead>
              <tbody>
                {data.filesList.items.map((file, index) => (
                  <tr>
                    <td key={index + "id"}>{file.fileId}</td>
                    <td key={index + "name"}>{file.filename}</td>
                    <td key={index + "url"}>{file.downloadUrl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        <h3>File Settings </h3>
          {dataSettings.filesSettingsList.count > 0 && (
            <table className="App-table">
              <thead>
                <tr>
                  <th>accessKeyId</th>
                  <th>secretAccessKey</th>
                </tr>
              </thead>
              <tbody>
                {dataSettings.filesSettingsList.items.map((file, index) => (
                  <tr>
                    <td key={index + "key"}>{file.settings.credentials.accessKeyId}</td>
                    <td key={index + "secret"}>{file.settings.credentials.secretAccessKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </header>
    </div>
  );
}

export default App;
