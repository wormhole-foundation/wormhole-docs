const switchLayout = {
  binary: 'switch',
  idSize: 1, // size of the payload ID
  idTag: 'messageType', // tag to identify the type of message
  layouts: [
    [[1, 'messageType1'], fillLayout], // layout for type 1
    [[2, 'messageType2'], fastFillLayout], // layout for type 2
  ],
} as const satisfies Layout;
