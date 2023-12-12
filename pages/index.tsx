import Image from "next/image";
import { Inter } from "next/font/google";
import logo from "@/public/santaLogo.png";
import { useRef, useState } from "react";
import openai from "@/utils/openai";
import ChatMessage from "@/components/ChatMessage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [msg, setMsg] = useState<string>("");
  const [childName, setChildName] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Mos Craciun🎅: Buna! Bine ai venit pe aplicatia mea! Daca vrei sa imi spui ce iti doresti de Craciun sau doar vrei sa discuti cu mine, scrie-mi mai jos!",
  ]);
  const input = useRef<HTMLInputElement | null>(null);

  const santaRequest = async (msg: string) => {
    const gptQuery = `Nu uita ca esti Mos Craciun! Raspunde urmatorului mesaj trimis de un copil catre tine: ${msg}, iar numele lui este ${childName}`;

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    setChatMessages((chatMessages) => [
      `Mos Craciun🎅: ${gptResults.choices[0].message.content}`,
      ...chatMessages,
    ]);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatMessages((chatMessages) => [
      `${childName}: ${msg}`,
      ...chatMessages,
    ]);
    santaRequest(msg);
    setMsg("");
  };

  const handleName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChildName(input.current!.value);
  };

  return (
    <main className={`  ${inter.className}`}>
      {childName !== "" ? (
        <div className="flex min-h-screen flex-col items-center gap-2 p-24 bg-green-800 transition-shadow">
          <Image src={logo} alt="logo" width="300" height="300" className="" />
          <div className="w-[60%] h-[600px] ml-2 p-2 border border-black bg-slate-100 rounded-lg overflow-y-scroll flex flex-col-reverse ">
            {chatMessages.map((message) => (
              <ChatMessage key={message} message={message} />
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="flex justify-center w-[60%] p-2 ml-2 border border-black rounded-lg bg-red-700"
          >
            <input
              className="p-2 w-full rounded-lg"
              placeholder="Spune-i mosului ce-ti doresti sa-ti aduca!"
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />
            <button className="px-2 mx-2 bg-green-800 rounded-lg text-white">
              Trimite
            </button>
          </form>
        </div>
      ) : (
        <form
          onSubmit={handleName}
          className="flex min-h-screen flex-col items-center gap-2 p-24 bg-green-800 "
        >
          <h1>Care este numele tau?</h1>
          <input ref={input} type="text" />
          <button>Trimite</button>
        </form>
      )}
    </main>
  );
}
