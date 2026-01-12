import express from "express";
import type { Request, Response } from 'express';
import * as GameService from '../services/gameService.js';
import * as DbService from '../services/dbService.js';
import type { Board, GameRow, GameStatus } from "../types/game.js";


export const handleMove = async (req: Request, res: Response) => {
    const { gameId, row, column, player } = req.body;

    try {
        const game = await DbService.getGameById(gameId);
        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        if (game.current_turn !== player) {
            return res.status(400).json({ success: false, error: "Not your turn!" });
        }

        const result = GameService.makeMove(game.board, row, column, player);
        if (!result.success) {
            return res.status(400).json({ success: result.success, error: result.error });
        }

        game.board = result.board

        const gameCheckResult: GameStatus = GameService.checkWinner(result.board);

        game.status = gameCheckResult.gameStatus
        game.winner = gameCheckResult.winner

        if(gameCheckResult.gameOver === false){
            game.current_turn = player === "X" ? "O" : "X"
        } 

        const updatedGame = await DbService.updateGame(game);

        return res.status(200).json({
            success: true,
            game: updatedGame
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const handleCreateGame = async (req: Request, resp: Response) =>{
    try {
        const gameId = await DbService.createGame();
    
        resp.status(201).json({
            success:true,
            gameId: gameId
        });
    } catch (err){
        console.error("Error Creating game: ", err);
        resp.status(500).json({
            success: false,
            message: "Failed to initilize new game"
        });
    }
}

export const handleGetGame = async (req: Request, res: Response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'No Gametag provided' 
        });
    }

    try {
        const game = await DbService.getGameById(id);
        
        if (!game) {
            return res.status(404).json({ 
                success: false, 
                message: 'Gametag not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            game 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};