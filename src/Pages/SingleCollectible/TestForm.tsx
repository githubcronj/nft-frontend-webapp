import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import TextField from "@mui/material/TextField";
import { useState, useContext } from "react";

//smart contract
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useNavigate } from "react-router-dom";

const TestForm = () => {
  const navigate= useNavigate()
  const { uploadToIPFS, createNFT, setCurrentAccount } = useContext(
    NFTMarketplaceContext
  );
  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [image, setImage] = useState<any>("");
  const router = "";
  const [file, setFile] = useState<Array<any | null>>([]);
  // console.log(name, price, desc, image);

  const handleSubmit = () => {
    // const fileInput = { name, price, description: desc };
    // createNFT(fileInput, image, router);
    // console.log(createNFT);
  };
  const handleChange = async (file: any) => {
    const url = await uploadToIPFS(file);
    setFile(url);
    setImage(url);
    console.log("File --> ", url);
  };
  const fileTypes = ["PNG", "GIF", "WEBP", "MP3", "Max1GB"];
  return (
    <>
      <Box p={5}>
        <Typography variant="h5" className="headText" p={2}>
          Create NFT
        </Typography>
        {/* <FileUploader uploadToIPFS={uploadToIPFS} setImage={setImage} /> */}
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          setImage={setImage}
          uploadToIPFS={uploadToIPFS}
          // onChange={(e: any) => setFileImg(e.target.files[0])}
        />
        <Box p={2}>
          <TextField
            onChange={(e) => {
              setName(e.target.value);
            }}
            id="outlined-basic"
            label="Name"
            variant="outlined"
          />
        </Box>
        <Box p={2}>
          <TextField
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            id="outlined-basic"
            label="Price"
            variant="outlined"
          />
        </Box>
        <Box p={2}>
          <TextField
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />
        </Box>
        <Button
          onClick={async () => {
            // const formInp = { name, price, description: desc };
           await createNFT(name, price, description, image);
            navigate('/search-filter')
          }}
          sx={{ mt: 4, p: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default TestForm;
