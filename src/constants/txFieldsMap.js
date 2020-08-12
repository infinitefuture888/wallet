const defaultFields = [{
    name: 'Action',
    field: '',
    linkType: ''
  },
  {
    name: 'Gas Used',
    field: 'gas_used',
    linkType: ''
  },
  {
    name: 'Memo',
    field: 'tx.value.memo',
    linkType: ''
  }
];

export const txFieldsMap = {
  // bank
  send_bank: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'From',
      field: 'tx.value.msg.0.value.from_address',
      linkType: 'address'
    },
    {
      name: 'To',
      field: 'tx.value.msg.0.value.to_address',
      linkType: 'address'
    }, {
      name: "Amount",
      field: 'tx.value.msg.0.value.amount',
      linkType: ''
    },
    ...defaultFields
  ],
  multisend_bank: [...defaultFields,
    {
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Inputs',
      field: 'tx.value.msg.0.value.inputs',
      linkType: 'address'
    },
    {
      name: 'Outputs',
      field: 'tx.value.msg.0.value.outputs',
      linkType: 'address'
    }
  ],

  // staking
  delegate_staking: [...defaultFields,
    {
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Destination Validator',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: 'validator'
    },
    {
      name: 'Delegation',
      field: 'tx.value.msg.0.value.amount',
      linkType: ''
    }
  ],
  begin_redelegate_staking: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator From',
      field: 'tx.value.msg.0.value.validator_src_address',
      linkType: 'validator'
    },
    {
      name: 'Validator To',
      field: 'tx.value.msg.0.value.validator_dst_address',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Shares Amount',
      field: 'tx.value.msg.0.value.amount',
      linkType: ''
    },
    ...defaultFields,
    {
      name: 'End Time',
      field: '',
      linkType: ''
    }
  ],
  begin_unbonding_staking: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Amount',
      field: 'tx.value.msg.0.value.amount',
      linkType: ''
    },
    ...defaultFields,
    {
      name: 'End Time',
      field: '',
      linkType: ''
    }
  ],
  create_validator_staking: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: 'validator'
    },
    {
      name: 'Owner',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Self Bond',
      field: 'tx.value.msg.0.value.value',
      linkType: ''
    },
    ...defaultFields,
    {
      name: 'Commission Rate',
      field: 'tx.value.msg.0.value.commission',
      linkType: ''
    },
    {
      name: 'Min Self Delegation',
      field: 'tx.value.msg.0.value.min_self_delegation',
      linkType: ''
    },
    {
      name: 'Description',
      field: 'tx.value.msg.0.value.description',
      linkType: ''
    }
  ],
  edit_validator_staking: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.address',
      linkType: 'validator'
    },
    {
      name: 'Moniker',
      field: 'tx.value.msg.0.value.Description.moniker',
      linkType: ''
    },
    ...defaultFields,
    {
      name: 'Identity',
      field: 'tx.value.msg.0.value.Description.identity',
      linkType: ''
    },
    {
      name: 'Website',
      field: 'tx.value.msg.0.value.Description.website',
      linkType: ''
    },
    {
      name: 'Details',
      field: 'tx.value.msg.0.value.Description.details',
      linkType: ''
    },
    {
      name: 'Commission Rate',
      field: 'tx.value.msg.0.value.commission_rate',
      linkType: ''
    },
    {
      name: 'Min Self Delegation',
      field: 'tx.value.msg.0.value.min_self_delegation',
      linkType: ''
    }
  ],

  // slashing
  unjail_slashing: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.address',
      linkType: 'validator'
    },
    ...defaultFields
  ],

  // distribution
  set_withdraw_address_distribution: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Delegator Address',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Withdraw Address',
      field: 'tx.value.msg.0.value.withdraw_address',
      linkType: 'address'
    },
    ...defaultFields
  ],
  withdraw_delegator_reward_distribution: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Delegator Address',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Validator Address',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: 'validator'
    },
    {
      name: 'Rewards',
      field: 'events.2.attributes.0.value',
      linkType: ''
    },
    ...defaultFields
  ],
  withdraw_validator_rewards_all_distribution: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Validator Address',
      field: 'tags.2.value',
      linkType: 'validator'
    },
    {
      name: 'Commission',
      field: 'tags.3.value',
      linkType: ''
    },
    ...defaultFields
  ],

  // gov
  submit_proposal_governance: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Proposal Id',
      field: 'events.1.attributes.1.value',
      linkType: ''
    },
    {
      name: 'Proposer',
      field: 'tx.value.msg.0.value.proposer',
      linkType: 'address'
    },
    {
      name: 'Proposal Type',
      field: 'tx.value.msg.0.value.content.type',
      linkType: ''
    },
    {
      name: 'Title',
      field: 'tx.value.msg.0.value.content.value.title',
      linkType: ''
    },
    ...defaultFields,
    {
      name: 'Description',
      field: 'tx.value.msg.0.value.content.value.description',
      linkType: ''
    },
    {
      name: 'Initial Deposit',
      field: 'tx.value.msg.0.value.initial_deposit',
      linkType: ''
    }
  ],
  deposit_governance: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Proposal Id',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: ''
    },
    {
      name: 'Depositor',
      field: 'tx.value.msg.0.value.depositor',
      linkType: 'address'
    },
    {
      name: 'Amount',
      field: 'tx.value.msg.0.value.amount',
      linkType: ''
    },
    ...defaultFields
  ],
  vote_governance: [{
      name: 'Time',
      field: 'timestamp',
      linkType: ''
    },
    {
      name: 'Txhash',
      field: 'txhash',
      linkType: 'tx'
    },
    {
      name: 'Block',
      field: 'height',
      linkType: 'block'
    },
    {
      name: 'Proposal Id',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: ''
    },
    {
      name: 'Option',
      field: 'tx.value.msg.0.value.option',
      linkType: ''
    },
    {
      name: 'Voter',
      field: 'tx.value.msg.0.value.voter',
      linkType: 'address'
    },
    ...defaultFields
  ]
};