import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';


const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private apollo: Apollo, private authService: AuthService) {}

  OnLogin() {
    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email: this.email, password: this.password }
    }).subscribe({
      next: (result: any) => {
        const token = result.data?.login?.token;
        if (token) {
          this.authService.setToken(token);
          window.location.reload();  // Refresh to apply auth changes
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
