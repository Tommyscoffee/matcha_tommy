import React, { createContext, useContext, useState } from "react";

export type PrifleDate = {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    images: string[];
    interests: number[];
    gender: string;
    sexual_preference: string;
    biography: string;
    latitude: string;
    longitude: string;
}

const defaultUser: PrifleDate = {//②デフォルトのユーザー情報
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  birth_date: "",
  images: [],
  interests: [],   
  gender: "",
  sexual_preference: "",
  biography: "",
  latitude: "",
  longitude: "",
};

const RegisterContext = createContext<{//①コンテキストの作成
  user: typeof defaultUser;
  setUser: React.Dispatch<React.SetStateAction<typeof defaultUser>>;
} | null>(null);

export function RegisterProvider({ children }: { children: React.ReactNode }) { //③プロバイダーでデータを提供
  const [user, setUser] = useState(defaultUser);

  return (
    <RegisterContext.Provider value={{ user, setUser }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useProfile() {
  return useContext(RegisterContext);
}
