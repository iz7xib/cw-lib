# CW Lib

CW Lib is a TypeScript library for generating Morse code from text. It allows you to convert regular text into Morse code audio signals.

## Installation

To install the library, run:

```bash
npm install learn-morse-code
```

## Usage

Here is a simple example of how to use the CW Lib in your application:

```typescript
import { CwPlayer } from 'learn-morse-code';

const player = new CwPlayer();
player.play("Hello World"); // Play the Morse code for "Hello World"
```

## API

### `CwPlayer`

- **constructor(frequency: number, dotDuration: number)**: Initializes the player with a specific frequency and dot duration.
- **play(text: string)**: Plays the Morse code for the given text.

## License

This project is licensed under the MIT License.