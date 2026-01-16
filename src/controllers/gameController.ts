import express from "express";
import type { Request, Response } from 'express';
import * as GameService from '../services/gameService.js';
import * as DbService from '../services/dbService.js';
import type { GameStatus } from "../types/game.js";
import { getIO } from "../services/socketService.js";

interface HandleMoveRequestBody {
    gameId: string;
    row: number;
    column:number;
    player:string
}

export const handleMove = async (req: Request<{},{},HandleMoveRequestBody>, res: Response) => {
    const { gameId, row, column, player } = req.body;

    try {
        const game = await DbService.getGameById(gameId);
        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        if (game.current_turn?.username !== player) {
            return res.status(400).json({ success: false, error: "Not your turn!" });
        }

        const result = GameService.makeMove(game.board, row, column, game.current_turn);
        if (!result.success) {
            return res.status(400).json({ success: result.success, error: result.error });
        }

        game.board = result.board

        const gameCheckResult: GameStatus = GameService.checkWinner(result.board);

        game.status = gameCheckResult.gameStatus
        game.winner = game.player1?.mark === gameCheckResult.winner ? game.player1 : game.player2;

        if(gameCheckResult.gameOver === false){
            game.current_turn = game.player1?.username === player ? game.player2 : game.player1; 
        } 

        const updatedGame = await DbService.updateGame(game);
        getIO().to(gameId).emit('game-updated', updatedGame);

        return res.status(200).json({
            success: true,
            game: updatedGame
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const handleFindGame = async (req: Request, resp: Response) =>{
    const {username} = req.body;
    console.log("Trying to find a Game for user: ", username);
    try {

        const exixtingGame = await DbService.getGameinWaiting(username);

        if (exixtingGame){
            console.log("Found Existin Game")
            exixtingGame.player2 = {username:username, mark:'O'}
            exixtingGame.status = "ongoing";
            exixtingGame.current_turn = exixtingGame.player1;

            const updatedGame = await DbService.updateGame(exixtingGame);

            return resp.status(200).json({
                success: true,
                gameId: updatedGame.id,
            });

        }

        console.log("Creating New Game")
        const gameId = await DbService.createGame(username);
    
        resp.status(201).json({
            success:true,
            gameId: gameId
        });

    } catch (err){
        console.error("Error Setting game: ", err);
        resp.status(500).json({
            success: false,
            message: "Error Setting game"
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