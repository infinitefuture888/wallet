/**
 * The mapping between the elements displayed in the transaction page and the tx data.
 * linkType has 5 options: '', 'tx', 'block', 'address', 'validator', 'token'. (default = '', for no link)
 */
const isMobile = !!navigator.userAgent.match(/iPad|iPhone|Android/);
let txFieldsList = {}
let defaultListFields = []
if (isMobile) {
  defaultListFields = [{
    name: 'Time',
    field: 'timestamp',
    linkType: ''
  }];
  txFieldsList = {
    // bank
    send: [
      ...defaultListFields,
      {
        name: "Amount",
        field: 'tx.value.msg.0.value.amount',
        linkType: ''
      }
    ],
    multisend: [
      ...defaultListFields,
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
    delegate: [
      ...defaultListFields,
      {
        name: 'Delegation',
        field: 'tx.value.msg.0.value.amount',
        linkType: ''
      }
    ],
    begin_redelegate: [
      ...defaultListFields,
      {
        name: 'Shares Amount',
        field: 'tx.value.msg.0.value.amount',
        linkType: ''
      }
    ],
    begin_unbonding: [
      ...defaultListFields,
      {
        name: 'Amount',
        field: 'tx.value.msg.0.value.amount',
        linkType: ''
      }
    ],
    create_validator: [
      ...defaultListFields,
      {
        name: 'Self Bond',
        field: 'tx.value.msg.0.value.value',
        linkType: ''
      }
    ],
    edit_validator: [
      ...defaultListFields,
      {
        name: 'Validator',
        field: 'tx.value.msg.0.value.address',
        linkType: 'validator'
      },
      {
        name: 'Moniker',
        field: 'tx.value.msg.0.value.Description.moniker',
        linkType: ''
      }
    ],

    // slashing
    unjail: [
      ...defaultListFields,
      {
        name: 'Validator',
        field: 'tx.value.msg.0.value.address',
        linkType: 'validator'
      }
    ],

    // distribution
    set_withdraw_address: [
      ...defaultListFields,
      {
        name: 'Delegator Address',
        field: 'tx.value.msg.0.value.delegator_address',
        linkType: 'address'
      },
      {
        name: 'Withdraw Address',
        field: 'tx.value.msg.0.value.withdraw_address',
        linkType: 'address'
      }
    ],
    withdraw_delegator_reward: [
      ...defaultListFields,
      {
        name: 'Rewards',
        field: 'events.2.attributes.0.value',
        linkType: ''
      }
    ],
    withdraw_validator_rewards_all: [
      ...defaultListFields,
      {
        name: 'Validator Address',
        field: 'tags.2.value',
        linkType: 'validator'
      },
      {
        name: 'Commission',
        field: 'tags.3.value',
        linkType: ''
      }
    ],

    // gov
    submit_proposal: [
      ...defaultListFields,
      {
        name: 'Proposal Id',
        field: 'events.1.attributes.1.value',
        linkType: ''
      },
      {
        name: 'Title',
        field: 'tx.value.msg.0.value.content.value.title',
        linkType: ''
      }
    ],
    deposit: [
      ...defaultListFields,
      {
        name: 'Amount',
        field: 'tx.value.msg.0.value.amount',
        linkType: ''
      }
    ],
    vote: [
      ...defaultListFields,
      {
        name: 'Proposal Id',
        field: 'tx.value.msg.0.value.proposal_id',
        linkType: ''
      },
      {
        name: 'Option',
        field: 'tx.value.msg.0.value.option',
        linkType: ''
      }
    ]
  };
} else {
  defaultListFields = [{
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
    }
  ];
  txFieldsList = {
    // bank
    send: [
      ...defaultListFields,
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
      }
    ],
    multisend: [
      ...defaultListFields,
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
    delegate: [
      ...defaultListFields,
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
    begin_redelegate: [
      ...defaultListFields,
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
      }
    ],
    begin_unbonding: [
      ...defaultListFields,
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
      }
    ],
    create_validator: [
      ...defaultListFields,
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
      }
    ],
    edit_validator: [
      ...defaultListFields,
      {
        name: 'Validator',
        field: 'tx.value.msg.0.value.address',
        linkType: 'validator'
      },
      {
        name: 'Moniker',
        field: 'tx.value.msg.0.value.Description.moniker',
        linkType: ''
      }
    ],

    // slashing
    unjail: [
      ...defaultListFields,
      {
        name: 'Validator',
        field: 'tx.value.msg.0.value.address',
        linkType: 'validator'
      }
    ],

    // distribution
    set_withdraw_address: [
      ...defaultListFields,
      {
        name: 'Delegator Address',
        field: 'tx.value.msg.0.value.delegator_address',
        linkType: 'address'
      },
      {
        name: 'Withdraw Address',
        field: 'tx.value.msg.0.value.withdraw_address',
        linkType: 'address'
      }
    ],
    withdraw_delegator_reward: [
      ...defaultListFields,
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
      }
    ],
    withdraw_validator_rewards_all: [
      ...defaultListFields,
      {
        name: 'Validator Address',
        field: 'tags.2.value',
        linkType: 'validator'
      },
      {
        name: 'Commission',
        field: 'tags.3.value',
        linkType: ''
      }
    ],

    // gov
    submit_proposal: [
      ...defaultListFields,
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
      }
    ],
    deposit: [
      ...defaultListFields,
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
      }
    ],
    vote: [
      ...defaultListFields,
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
      }
    ]
  };
}
export {
  txFieldsList,
  defaultListFields
}