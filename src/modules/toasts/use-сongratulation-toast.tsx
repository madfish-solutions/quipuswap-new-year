import { useToastNotification } from "./use-toast-notification";
import {WonNft} from '../../components/won-nft'

export const useToast = () => {
    const showToast = useToastNotification();

  
    const imageToast = (src: string) =>
      showToast({
        type: 'success',
        render: (<WonNft src = {src}/>)
      });
  
    return {
      imageToast
    };
  };