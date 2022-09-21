describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Urho Kekkonen',
      username: 'UKK',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('UKK')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Urho Kekkonen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('UKK')
      cy.get('#password').type('HerraPresidentti')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Urho Kekkonen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'UKK', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('Viinaa saunalla Breznevin kanssa')
      cy.get('input[placeholder="Author"]').type('Urho Kekkonen')
      cy.get('input[placeholder="URL"]').type('www.urkinseikkailut.gov.fi')
      cy.get('#createButton').click()

      cy.contains('Viinaa saunalla Breznevin kanssa Urho Kekkonen')
    })

    describe('and blogs exists', function(){
      beforeEach(function (){
        cy.createBlog({ title: 'eka blogi', author: 'Pekka Bloggaaja', url: 'www.blogimaa.fi', likes:0  })
        cy.createBlog({ title: 'toka blogi', author: 'Pekka Bloggaaja', url: 'www.blogimaa.fi', likes:0 })
        cy.createBlog({ title: 'vika blogi', author: 'Pekka Bloggaaja', url: 'www.blogimaa.fi', likes:0 })
      })
      it('A blog can be liked', function(){
        cy.contains('eka blogi').parent().as('blogi')
        cy.get('@blogi').find('button').contains('view').click()
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('1')
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('2')
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('3')
      })

      it('A blog can be deleted', function () {
        cy.contains('toka blogi').parent().as('blog')
        cy.get('@blog').find('button').contains('view').click()
        cy.get('@blog').find('button').contains('Remove').click()
        cy.get('html').should('not.contain', 'toka blogi')
      })

      it('Blogs in popularity order', function () {
        cy.contains('eka blogi').parent().as('blogi')
        cy.get('@blogi').find('button').contains('view').click()
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('1')
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('2')
        cy.get('@blogi').find('button').contains('like').click()
        cy.get('@blogi').find('div').contains('3')
        cy.get('@blogi').find('button').contains('hide').click()

        cy.contains('vika').parent().as('blog')
        cy.get('@blog').find('button').contains('view').click()
        cy.get('@blog').find('button').contains('like').click()
        cy.get('@blog').find('div').contains('1')
        cy.get('@blog').find('button').contains('like').click()
        cy.get('@blog').find('div').contains('2')
        cy.get('@blog').find('button').contains('hide').click()

        cy.get('.blogs').eq(0).contains('eka blogi')
        cy.get('.blogs').eq(1).contains('vika blogi')
        cy.get('.blogs').eq(2).contains('toka blogi')
      })
    })
  })
})