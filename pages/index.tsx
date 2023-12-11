import Image from "next/image";
import { Inter } from "next/font/google";
import logo from "@/public/santaLogo.png";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [message, setMessage] = useState<string>("");

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-2 p-24 bg-slate-400 ${inter.className}`}
    >
      <Image src={logo} alt="logo" width="300" height="300" />
      <div className="w-[60%] h-[600px] ml-2 p-2 border border-black bg-slate-100 rounded-lg overflow-y-scroll flex "></div>
      <form
        onSubmit={handleSend}
        className="flex justify-center w-[60%] p-2 ml-2 border border-black rounded-lg"
      >
        <input
          className="p-2 w-full rounded-lg"
          placeholder="Spune-i mosului ce-ti doresti sa-ti aduca!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-2 mx-2 bg-green-100 rounded-lg">Trimite</button>
      </form>
    </main>
  );
}
