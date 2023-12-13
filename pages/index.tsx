import Image from "next/image";
import { Inter } from "next/font/google";
import background from "@/public/backgroundApp.jpg";
import santaAvatar from "@/public/test.jpg";
import { useRef, useState } from "react";
import openai from "@/utils/openai";
import ChatMessage from "@/components/ChatMessage";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [msg, setMsg] = useState<string>("");
  const [childName, setChildName] = useState<string>("");
  const [isWritting, setIsWritting] = useState<boolean>(false);
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
    setIsWritting(false);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatMessages((chatMessages) => [
      `${childName}: ${msg}`,
      ...chatMessages,
    ]);
    setIsWritting(true);
    santaRequest(msg);
    setMsg("");
  };

  const handleName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChildName(input.current!.value);
  };

  return (
    <main className={`${inter.className}`}>
      <Head>
        <title>Chat-ul lui Mos Craciun</title>
      </Head>
      <div className="absolute">
        <Image
          src={background}
          className="h-screen object-cover"
          alt="background"
        />
      </div>
      {childName !== "" ? (
        <div className="flex min-h-screen flex-col items-center justify-center transition-shadow absolute shadow-lg sm:left-[20%] sm:right-[20%] m-2">
          <div className="flex items-center gap-x-2 border-x border-t border-black/70 rounded-t-lg w-full md:w-[60%] bg-red-700 p-2 text-white bg-opacity-90">
            <Image
              src={santaAvatar}
              width="70"
              height="70"
              alt="santa avatar"
              className="rounded-full "
            ></Image>
            <div>
              <h1 className="font-bold">Mos Craciun</h1>
              {isWritting && <p>iti raspunde acum..</p>}
            </div>
          </div>
          <div className="w-full md:w-[60%] h-[400px] p-2 border-x border-black bg-slate-100 overflow-y-scroll flex flex-col-reverse shadow-lg bg-opacity-90">
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="flex justify-center w-full md:w-[60%] p-2 border border-black rounded-b-lg bg-red-700 shadow-lg bg-opacity-90"
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
        <div className="fixed top-[40%] right-0 left-0 sm:right-[40%] sm:left-[40%]">
          <form
            onSubmit={handleName}
            className="flex flex-col p-2 gap-2 bg-white rounded-lg bg-opacity-80 sm:fixed mx-5"
          >
            <h1 className="text-xl font-bold">Care este numele tau?</h1>
            <div className="flex">
              <input
                ref={input}
                type="text"
                className="p-2 m-auto rounded-lg border border-black/70"
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
