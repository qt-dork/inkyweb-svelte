import { writable } from 'svelte/store'

interface StoryState {
  texts: Text[];
  choices: Choice[];
}
type Text = {
  text: string;
  classList: string[];
  delay: number;
}
const Text = (text: string, classList: string[] = []): Text => ({text, classList, delay: 0})
interface Choice {
  text: string;
  index: number;
  delay: number;
}
const Choice = (text: string, index: number): Choice => ({text, index, delay: 0})

export const stories = writable<StoryState>({texts: [], choices: []})