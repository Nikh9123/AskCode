import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);//imgUrl is value and setImgUrl is the function to set the value
	const showToast = useShowToast();
	const handleImageChange = (e) => {
    //todo: check if the file is an image
		const file = e.target.files[0];
    //if image then set the image url
		if(file && file.type.startsWith('image/')) {
      const reader = new FileReader();// the fileredaer api will allow us to read the file in string format
      console.log("readre: ",reader);
      reader.onloadend = ()=>{
        setImgUrl(reader.result);
      }
      reader.readAsDataURL(file);// read the file as a data url
    }
    else{ //if not an image then show error
      showToast("Invalid file type ", "Please upload an image file", "error");
      setImgUrl(null);
    }
	};
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;