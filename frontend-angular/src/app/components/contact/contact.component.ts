import { Component, OnInit } from '@angular/core';
import {GithubService} from "../../services/github.service";


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  // Variáveis para armazenar os perfis
  profiles: any[] = [];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    const users = [
      {
        username: 'nicolasaigner',
        linkedin: 'https://www.linkedin.com/in/nicolasaigner',
        turma: 'CC2Ead'
      },
      {
        username: 'elisaharmmer',
        linkedin: 'https://www.linkedin.com/in/elisaharmmerferreira',
        turma: 'SI2Ead'
      },
    ];

    users.forEach((user) => {
      this.githubService.getUserProfile(user.username).subscribe(
        (data) => {
          data.linkedin = user.linkedin;
          data.turma = user.turma;
          this.profiles.push(data);
        },
        (error) => {
          console.error(`Erro ao obter perfil de ${user.username}:`, error);
        }
      );
    });
  }

}
