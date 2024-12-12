import { DefaultTheme, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  base: "/gol-docs/",
  title: "CSA - Game of Life",
  description: "Computer System A Coursework - University of Bristol",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    editLink: {
      pattern: 'https://github.com/UoB-CSA/gol-docs/edit/master/docs/:path'
    },

    // nav: [
    //   { text: 'Home', link: '/', activeMatch: '^\/[^\/]*$|^\/?$' },
    //   { text: 'Golang Coursework', link: '/golang/overview', activeMatch: '^\/golang\/.*$' },
    //   { text: 'Rust Extension', link: '/rust/overview', activeMatch: '^\/rust\/.*$' },
    // ],

    sidebar: {
      '/': homeDocs().concat(golangDocs()),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/UoB-CSA/gol-skeleton' }
    ],

    search: {
      provider: 'local'
    }
  }
})

function homeDocs(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        { text: 'Home', link: "/" },
        { text: 'Submission', link: '/submission' },
      ]
    },
  ]
}

function golangDocs(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        { text: 'Overview', link: '/golang/overview' },
        { text: 'Parallel Implementation', collapsed: true, link: '/golang/parallel/', items:
          [
            { text: 'Step 1', link: '/golang/parallel/step-1' },
            { text: 'Step 2', link: '/golang/parallel/step-2' },
            { text: 'Step 3', link: '/golang/parallel/step-3' },
            { text: 'Step 4', link: '/golang/parallel/step-4' },
            { text: 'Step 5', link: '/golang/parallel/step-5' },
            { text: 'Step 6', link: '/golang/parallel/step-6' },
            { text: 'Success Criteria', link: '/golang/parallel/success-criteria' },
            { text: 'In Your Report', link: '/golang/parallel/in-your-report' },
          ]
        },
        { text: 'Distributed Implementation', collapsed: true, link: '/golang/distributed/', items:
          [
            { text: 'Step 1', link: '/golang/distributed/step-1' },
            { text: 'Step 2', link: '/golang/distributed/step-2' },
            { text: 'Step 3', link: '/golang/distributed/step-3' },
            { text: 'Step 4', link: '/golang/distributed/step-4' },
            { text: 'Step 5', link: '/golang/distributed/step-5' },
            { text: 'Step 6', link: '/golang/distributed/step-6' },
            { text: 'Success Criteria', link: '/golang/distributed/success-criteria' },
            { text: 'In Your Report', link: '/golang/distributed/in-your-report' },
          ]
        },
        { text: 'Extensions', link: '/golang/extensions' },

        // Comment out the following code to hide rust extension
        // -------Starting from here-------
        { text: 'Extensions - Rust language', collapsed: true, items:
          [
            { text: 'Overview', link: '/rust/overview' },
            { text: 'Setup Guide', link: '/rust/setup-guide' },
            { text: 'Before Start', link: '/rust/before-start' },
            { text: 'Parallel Implementation', collapsed: true, link: '/rust/parallel/', items:
              [
                { text: 'Step 1', link: '/rust/parallel/step-1' },
                { text: 'Step 2', link: '/rust/parallel/step-2' },
                { text: 'Step 3', link: '/rust/parallel/step-3' },
                { text: 'Step 4', link: '/rust/parallel/step-4' },
                { text: 'Step 5', link: '/rust/parallel/step-5' },
                { text: 'Success Criteria', link: '/rust/parallel/success-criteria' },
                { text: 'In Your Report', link: '/rust/parallel/in-your-report' },
              ]
            },
            { text: 'Distributed Implementation', collapsed: true, link: '/rust/distributed/', items:
              [
                { text: 'Step 0', link: '/rust/distributed/step-0' },
                { text: 'Step 1', link: '/rust/distributed/step-1' },
                { text: 'Step 2', link: '/rust/distributed/step-2' },
                { text: 'Step 3', link: '/rust/distributed/step-3' },
                { text: 'Step 4', link: '/rust/distributed/step-4' },
                { text: 'Step 5', link: '/rust/distributed/step-5' },
                { text: 'Step 6', link: '/rust/distributed/step-6' },
                { text: 'Success Criteria', link: '/rust/distributed/success-criteria' },
                { text: 'In Your Report', link: '/rust/distributed/in-your-report' },
              ]
            }
          ]
        },
        // -------End comment-------
        { text: 'Report Guidance', link: '/golang/report-guidance' },
        { text: 'Marking Scheme', link: '/golang/marking-scheme' },
        { text: 'Viva', link: '/golang/viva' },
      ]
    },
  ]
}
