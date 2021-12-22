import { Box } from './box';

export const YouStacked = () => {
  return (
    <Box>
      <div className="you-staked_wrapper">
        <div className="you-staked">
          <div>
            <div>You Staked:</div>
            <div>200.00 QUIPU</div>
          </div>
          <div>
            <div>Lock countdown:</div>
            <div>--.--.--</div>
          </div>
          <button className='pretty-button'>Unstake</button>
        </div>
      </div>
    </Box>
  );
};
