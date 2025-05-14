import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { UserSigninInformation } from "../../utils/validate";

export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (userInfo: UserSigninInformation) => login(userInfo),
  });
};