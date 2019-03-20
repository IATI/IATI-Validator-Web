export interface Ruleset {
  src: string;
  severity: string;
}

export interface Context {
  text: string;
}

export interface Message {
  id: string;
  text: string;
  rulesets: Ruleset[];
  context: Context[];
}

export interface Feedback {
  category: string;
  label: string;
  messages: Message[];
}

export interface Activity {
  title: string;
  identifier: string;
  publisher: string;
  feedback: Feedback[];
}

export interface Dqfs {
  activities: Activity[];
}


