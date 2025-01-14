export enum ModelType {
  CLAUDE = 'claude-3-5-sonnet-20241022',
  GPT_40 = 'gpt-4-0125-preview',
  GPT_O1 = 'o1-2024-12-17',
}

export const ModelLabels = {
  [ModelType.CLAUDE]: 'Claude',
  [ModelType.GPT_40]: 'Chat GPT 4',
  [ModelType.GPT_O1]: 'Chat GPT O1',
};

export const ModelMaxTokens = {
  [ModelType.CLAUDE]: 8192,
  [ModelType.GPT_40]: 4096,
  [ModelType.GPT_O1]: 4096,
};
