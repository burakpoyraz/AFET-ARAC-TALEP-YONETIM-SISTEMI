import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient=new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,
      retry:1,
    },
    mutations:{
      retry: false,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
      onSuccess: (data) => {
        console.log("Mutation success:", data);
      },
    },
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </BrowserRouter>
    
  </StrictMode>
);
