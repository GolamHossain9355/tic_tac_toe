import { toast } from "react-toastify"

export type CloseLoadingAlert = {
   render: string
   type: typeof toast.TYPE.SUCCESS
   isLoading: false
   autoClose: 3000 | 4000 | 5000 | 1000
   closeOnClick: true
}

export const defaultCloseLoadingAlertValues: {
   isLoading: false
   autoClose: 4000 | 3000 | 5000 | 1000
   closeOnClick: true
} = {
   autoClose: 3000,
   closeOnClick: true,
   isLoading: false,
}

export const dismissPrevToasts = (id?: any) => {
   setTimeout(() => {
      toast.dismiss(id)
   }, 2000)
}
