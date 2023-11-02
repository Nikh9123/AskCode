import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Link to="/login">
      <Flex w={"full"} justifyContent={"center"}>
        {/* <Button colorScheme={"blue"}>Login</Button> */}
        <Button colorScheme={"blue"}>HomePage</Button>
      </Flex>
     </Link> 
  )
}

export default HomePage;