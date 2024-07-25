import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from 'ethers';
import * as jdenticon from 'jdenticon';

const Main = ({ state, account }) => {
  const { contract } = state;
  const [description, setDescription] = useState("");
  const [hash, setHash] = useState("");
  const [imagesArray, setImagesArray] = useState([]);

  const uploadToIpfs = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `35cb1bf7be19d2a8fa0d`,
        pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
        "Content-Type": "multipart/form-data",
      },
    });
    const resData = await res.data;
    setHash(`${resData.IpfsHash}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx = await contract.uploadImage(hash, description);
    await tx.wait();
    loadPosts();
  };

  const loadPosts = async () => {
    let imagesArray = [];

    const imgCount = await contract.imageCount();
    for (let i = 1; i <= imgCount; i++) {
      const url = await contract.images(i);
      imagesArray.push(url);
    }
    setImagesArray(imagesArray);
    imagesArray = imagesArray.sort((a, b) => Number(b.tipAmount) - Number(a.tipAmount));

  };

  useEffect(() => {
    loadPosts();
  });

  useEffect(() => {
    jdenticon.update("[data-jdenticon-value]");
  }, [imagesArray]);

  const handleTip = async (image) => {
    await(
        await contract.tipImageOwner(image.id, {value: ethers.parseEther("0.1")})
    ).wait();    
    loadPosts();
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            <h2>Share Image</h2>
            <h3>{hash}</h3>
            <form onSubmit={handleSubmit}>
              <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={uploadToIpfs} />
              <div className="form-group mr-sm-2">
                <br></br>
                <input
                  id="imageDescription"
                  type="text"
                  className="form-control"
                  placeholder="Image description..."
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
            </form>
            <p>&nbsp;</p>
            {imagesArray.map((image, key) => {
              if(image.id !=5){
                return (
                    <div className="card mb-4" key={key}>
                      <div className="card-header">
                        <svg
                          className='mr-2'
                          width='30'
                          height='30'
                          data-jdenticon-value={image.author}
                        />
                        <small className="text-muted">{image.author}</small>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px' }} alt="Image" /></p>
                          <p>{image.description}</p>
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <small className="float-left mt-1 text-muted">
                            TIPS: {ethers.formatEther(image.tipAmount.toString())} ETH
                          </small>
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={image.id}
                            onClick={()=>handleTip(image)}>
                            TIP 0.1 ETH
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
              }
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;
