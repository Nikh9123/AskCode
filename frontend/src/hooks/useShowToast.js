import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
	const toast = useToast();
	const showToast = useCallback(
		(
			title,
			description,
			status //useCallback is used to prevent infinite loop when using this hook is called and the component is re-rendered
		) =>
			toast({
				title,
				description,
				status,
				duration: 3000,
				isClosable: true,
				position: "top",
			}),
		[toast]
	);
	return showToast;
};

export default useShowToast;
