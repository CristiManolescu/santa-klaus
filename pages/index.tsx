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
    <main className={`${inter.className}`}>
      {childName !== "" ? (
        <div className="flex min-h-screen flex-col items-center w-full bg-green-800 transition-shadow">
          <Image
            src={logo}
            alt="logo"
            width="300"
            height="300"
            className="w-[250px] h-[250px] md:w-[300px] md:h-[300px]"
          />
          <div className="w-full md:w-[60%] h-[400px] p-2 border border-black bg-slate-100 rounded-lg overflow-y-scroll flex flex-col-reverse shadow-lg">
            {chatMessages.map((message) => (
              <ChatMessage key={message} message={message} />
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="flex justify-center w-full md:w-[60%] p-2 mt-2 border border-black rounded-lg bg-red-700 shadow-lg"
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
        <div className="flex min-h-screen bg-green-800">
          <form
            onSubmit={handleName}
            className="flex flex-col w-[60%] m-auto items-center gap-2 bg-green-800"
          >
            <h1 className="text-xl font-bold">Care este numele tau?</h1>
            <div className="flex">
              <input
                ref={input}
                type="text"
                className="p-2 m-auto rounded-lg"
                placeholder="Pe mine ma cheama.."
              />
              <button className="p-2 bg-red-700 text-white rounded-lg m-2">
                Trimite
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
