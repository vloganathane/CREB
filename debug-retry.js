import { RetryPolicy } from './src/core/resilience/RetryPolicy.js';

async function test() {
  let attempts = 0;
  const policy = new RetryPolicy({
    maxAttempts: 3,
    initialDelay: 100,
    onRetry: (error, attempt, delay) => {
      console.log(`Retry attempt ${attempt} with delay ${delay}ms`);
    }
  });

  const result = await policy.execute(async () => {
    attempts++;
    console.log(`Executing attempt ${attempts}`);
    if (attempts < 3) {
      throw new Error(`Attempt ${attempts} failed`);
    }
    return 'success';
  });

  console.log('Result:', result);
}

test().catch(console.error);
