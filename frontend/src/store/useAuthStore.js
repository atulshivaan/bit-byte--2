import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
import { data } from "react-router-dom";

import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,
     checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser :res.data});
        } catch (error) {
            console.log("Error in checkAuth",error);
            set({authUser:null})
            
        }finally{
            set({isCheckingAuth:false});
        }
     },

     signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", formData);
          set({ authUser: res.data });
          toast.success("Account created successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed!");
        } finally {
          set({ isSigningUp: false });
        }
      },
      login:async(data)=>{
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
      logout:async()=>{
        try {
          await axiosInstance.post("/auth/logout");
          set({authUser:null});
          toast.success("Logged out Succesfully");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      updateProfile: async (data) => {
        console.log("Data passed to updateProfile:", data); // Debug log
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          console.log("API Response:", res); // Debug log
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in update profile:", error);
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    
      
}));