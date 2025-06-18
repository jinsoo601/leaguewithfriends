export default function Home() {
  return (
    <main className="p-4">
      <form action="/group" method="GET">
        <label htmlFor="riotIds">Enter Riot IDs (comma-separated, format: name#tag)</label>
        <input
          id="riotIds"
          name="riotIds"
          className="border p-2 m-2"
          type="text"
          placeholder="e.g. Player1#TAG1, Player2#TAG2"
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          View Group Stats
        </button>
      </form>
    </main>
  );
}