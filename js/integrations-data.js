/* ==========================================================================
   Integrations CMS collection
   --------------------------------------------------------------------------
   This file stands in for the Framer CMS. In Framer:
     collection = this whole list      (Integrations)
     field      = one column           (System name, Purpose, Data shared, Status)
     item       = one row              (one connected system)

   The same two rows are in cms/integrations.csv, ready to import into Framer.
   If you change a row here, change it in the CSV too.
   Write apostrophes as plain ' here; the page turns them into curly ones.
   ========================================================================== */
window.SDET_CMS = {
  integrations: {
    collection: 'Integrations',

    fields: [
      { key: 'systemName', label: 'System name', framerType: 'Plain Text' },
      { key: 'purpose',    label: 'Purpose',     framerType: 'Plain Text' },
      { key: 'dataShared', label: 'Data shared', framerType: 'Plain Text' },
      { key: 'status',     label: 'Status',      framerType: 'Option',
        options: ['Simulated', 'Outside our system, not connected'] }
    ],

    items: [
      {
        slug: 'email-gateway',
        systemName: 'Email Gateway',
        purpose: 'Delivers the tracker\'s reminder and decision emails, and reports back whether each one arrived.',
        dataShared: 'Sent: the recipient\'s email address, the subject, and the message. Returned: the delivery status (sent, bounced, or failed).',
        status: 'Simulated'
      },
      {
        slug: 'lto',
        systemName: 'LTO (Land Transportation Office)',
        purpose: 'Where riders renew their driver\'s licenses and where vans are registered. The renewal happens there, not in the tracker.',
        dataShared: 'None. The owner brings back the renewed copy and uploads it.',
        status: 'Outside our system, not connected'
      }
    ]
  }
};
