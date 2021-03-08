(() => ({
  name: 'Skill Matrix',
  icon: 'DataContainer',
  category: 'TABLE',
  structure: [
    {
      name: 'skillMatrix',
      options: [
        {
          type: 'COLOR',
          label: 'Mastered Color',
          key: 'masteredColor',
          value: 'Primary',
        },
        {
          type: 'COLOR',
          label: 'Learning Color',
          key: 'learningColor',
          value: 'Secondary',
        },
      ],
      descendants: [],
    },
  ],
}))();
