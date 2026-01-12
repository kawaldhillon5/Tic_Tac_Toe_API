import express from "express";
import type { Request, Response } from 'express';
import * as GameService from '../services/gameService.js';
import * as DbService from '../services/dbService.js';


export const handleMove = (req: Request, res: Response) => {
    const { board, row, column, player } = req.body;

    const result = GameService.makeMove(board, row, column, player);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.error
        });
    }

    const gameStatus = GameService.checkWinner(result.board);

    return res.status(200).json({
        success: true,
        board: result.board,
        status: gameStatus
    });
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