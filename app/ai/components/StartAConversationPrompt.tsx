interface StartAConversationPromptProps {
  chatStarted: boolean
}

function StartAConversationPrompt({ chatStarted }: StartAConversationPromptProps) {
  return (
    <>
      {!chatStarted && (
        <div className="text-4xl font-bold mb-10 text-center">有什么可以帮忙的？</div>
      )}
    </>
  )
}

export { StartAConversationPrompt }
export default StartAConversationPrompt
