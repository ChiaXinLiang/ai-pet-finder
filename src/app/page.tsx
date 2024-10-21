"use client";

import { useChat } from "ai/react";
import Markdown from "react-markdown";

import { Input } from "@/components/ui/input";

import type { Pet } from "@/pets";
import PetCard from "@/pet-card";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "showPets") {
          return "Pets were shown to the user.";
        }
      },
    });

  return (
    <div className="flex flex-col w-full max-w-4xl pb-24 pt-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Ask me about an adoptable pet
      </h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-row gap-2">
            <div className={message.role === "user" ? "font-bold" : ""}>
              {message.toolInvocations ? (
                message.toolInvocations.map((tool, index) => (
                  <>
                    {tool.toolName === "showPets" &&
                      tool.state === "result" && (
                        <div className="flex flex-wrap">
                          {tool.args.pets.map(
                            (
                              pet: Pet & { recommendation: string },
                              petIndex: number
                            ) => (
                              <div
                                className="p-2 w-1/2"
                                key={`${message.id}-${index}-${petIndex}`}
                              >
                                <PetCard {...pet} />
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </>
                ))
              ) : (
                <div className={message.role === "user" ? "font-bold" : ""}>
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div>Working on it...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed bottom-0 w-full max-w-4xl p-2 mb-8 "
          value={input}
          placeholder="What kind of pet are you looking for?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
