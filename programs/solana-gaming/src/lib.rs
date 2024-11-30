use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    program::invoke,
    system_instruction,
};

declare_id!("Gaming11111111111111111111111111111111111111");

#[program]
pub mod solana_gaming {
    use super::*;

    pub fn initialize_house(ctx: Context<InitializeHouse>) -> Result<()> {
        let house = &mut ctx.accounts.house;
        house.authority = ctx.accounts.authority.key();
        house.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let from = ctx.accounts.player.to_account_info();
        let to = ctx.accounts.house.to_account_info();

        // Transfer SOL from player to house account
        invoke(
            &system_instruction::transfer(
                &from.key(),
                &to.key(),
                amount,
            ),
            &[from, to.clone()],
        )?;

        // Update house balance
        let house = &mut ctx.accounts.house;
        house.balance = house.balance.checked_add(amount).unwrap();

        // Update player state
        let player = &mut ctx.accounts.player_state;
        player.balance = player.balance.checked_add(amount).unwrap();
        
        emit!(DepositEvent {
            player: ctx.accounts.player.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        require!(player_state.balance >= amount, ErrorCode::InsufficientFunds);

        let house = &mut ctx.accounts.house;
        **house.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.player.try_borrow_mut_lamports()? += amount;

        player_state.balance = player_state.balance.checked_sub(amount).unwrap();
        house.balance = house.balance.checked_sub(amount).unwrap();

        emit!(WithdrawEvent {
            player: ctx.accounts.player.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn play_blackjack(ctx: Context<PlayGame>, bet_amount: u64) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        require!(player_state.balance >= bet_amount, ErrorCode::InsufficientFunds);

        // Deduct bet amount from player's balance
        player_state.balance = player_state.balance.checked_sub(bet_amount).unwrap();
        
        // Game logic will be handled client-side for now
        // This just records the bet and updates balances
        
        emit!(GameStartedEvent {
            player: ctx.accounts.player.key(),
            game_type: GameType::Blackjack,
            bet_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn settle_game(ctx: Context<SettleGame>, amount: u64, won: bool) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        
        if won {
            player_state.balance = player_state.balance.checked_add(amount.checked_mul(2).unwrap()).unwrap();
        }

        emit!(GameSettledEvent {
            player: ctx.accounts.player.key(),
            amount,
            won,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeHouse<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + HouseState::SIZE
    )]
    pub house: Account<'info, HouseState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub house: Account<'info, HouseState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        init_if_needed,
        payer = player,
        space = 8 + PlayerState::SIZE,
        seeds = [b"player", player.key().as_ref()],
        bump
    )]
    pub player_state: Account<'info, PlayerState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub house: Account<'info, HouseState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [b"player", player.key().as_ref()],
        bump
    )]
    pub player_state: Account<'info, PlayerState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlayGame<'info> {
    #[account(mut)]
    pub house: Account<'info, HouseState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [b"player", player.key().as_ref()],
        bump
    )]
    pub player_state: Account<'info, PlayerState>,
}

#[derive(Accounts)]
pub struct SettleGame<'info> {
    #[account(mut)]
    pub house: Account<'info, HouseState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [b"player", player.key().as_ref()],
        bump
    )]
    pub player_state: Account<'info, PlayerState>,
}

#[account]
pub struct HouseState {
    pub authority: Pubkey,
    pub balance: u64,
}

#[account]
pub struct PlayerState {
    pub balance: u64,
    pub last_played: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameType {
    Blackjack,
    Roulette,
}

impl HouseState {
    pub const SIZE: usize = 32 + 8; // pubkey + u64
}

impl PlayerState {
    pub const SIZE: usize = 8 + 8; // u64 + i64
}

#[event]
pub struct DepositEvent {
    pub player: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawEvent {
    pub player: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct GameStartedEvent {
    pub player: Pubkey,
    pub game_type: GameType,
    pub bet_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct GameSettledEvent {
    pub player: Pubkey,
    pub amount: u64,
    pub won: bool,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds for this operation")]
    InsufficientFunds,
    #[msg("Invalid bet amount")]
    InvalidBetAmount,
    #[msg("Unauthorized operation")]
    Unauthorized,
}