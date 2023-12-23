describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Vince',
      username: 'test',
      password: 'test'
    }
    const user2 = {
      name: 'Not Vince',
      username: 'test2',
      password: 'test2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.get('#loginForm')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      cy.contains('Vince logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('#notification')
        .should('contain', 'Wrong Username or Password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Vince logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: 'test' })
    })

    it('A blog can be created', function () {
      cy.contains('Create new blog').click()
      cy.get('#title').type('This is a new blog')
      cy.get('#author').type('VTYY')
      cy.get('#url').type('www.blog.com')
      cy.get('#create').click()
      cy.contains('This is a new blog VTYY')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog',
          author: 'VTYY',
          url: 'www.blog2.com',
          likes: 0
        })
      })

      it('it can be liked', function () {
        cy.contains('another blog').parent().find('button').click()
        cy.get('#likes').find('button').click()
        cy.get('#likes').contains('Likes 1')
      })

      it('it can be deleted', function () {
        cy.contains('another blog').parent().find('button').click()
        cy.get('#delete').click()
        cy.get('html').should('not.contain', 'another blog VTYY')
      })

      it('it cannot be deleted by another user', function () {
        cy.login({ username: 'test2', password: 'test2' })
        cy.contains('another blog').parent().find('button').click()
        cy.get('#delete').should('not.exist')
      })
    })


    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the third most likes',
          author: 'VTYY',
          url: 'www.blog3.com',
          likes: 0
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'VTYY',
          url: 'www.blog2.com',
          likes: 0
        })
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'VTYY',
          url: 'www.blog.com',
          likes: 0
        })
      })

      it('is ordered according to likes', function () {
        cy.contains('The title with the most likes').find('#toggleDetails').click()
        cy.contains('The title with the most likes').parent().find('#likes').find('button').click()
        cy.wait(500)
        cy.contains('The title with the most likes').parent().find('#likes').find('button').click()
        cy.contains('The title with the most likes').find('#toggleDetails').click()

        cy.contains('The title with the second most likes').find('#toggleDetails').click()
        cy.contains('The title with the second most likes').parent().find('#likes').find('button').click()
        cy.contains('The title with the second most likes').find('#toggleDetails').click()

        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the third most likes')
      })
    })
  })

})