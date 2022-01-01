interface OnTheFlyAction {
  messageType: string;
  target_component: string;
  cmd: string;
  assets: string[];
  params: { [key: string]: unknown };
}

export { OnTheFlyAction };
