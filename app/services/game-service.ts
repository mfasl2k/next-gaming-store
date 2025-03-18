import Game from "../types/game";

export const GameService = {
  async getAllGames(): Promise<Game[]> {
    try {
      const response = await fetch(`/api/games`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.status}`);
      }

      const games: Game[] = await response.json();
      return games.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } catch (error) {
      console.error("Failed to fetch games:", error);
      throw error;
    }
  },

  async getGameById(id: string): Promise<Game> {
    try {
      const response = await fetch(`/api/games/${id}`);

      if (!response.ok) {
        throw new Error(`Error fetching game: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch game with ID ${id}:`, error);
      throw error;
    }
  },

  async createGame(
    gameData: Omit<Game, "id" | "createdAt" | "updatedAt">
  ): Promise<Game> {
    try {
      const response = await fetch(`/api/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error(`Error creating game: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to create game:", error);
      throw error;
    }
  },

  async updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error(`Error updating game: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to update game with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteGame(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error deleting game: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to delete game with ID ${id}:`, error);
      throw error;
    }
  },
};
