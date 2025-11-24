from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            """
            DROP TABLE tenants_tenantuser;
            CREATE TABLE "tenants_tenantuser" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
                "role" varchar(20) NOT NULL, 
                "tenant_id" bigint NOT NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, 
                "user_id" integer NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED
            );
            CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
            """,
            """
            DROP TABLE tenants_tenantuser;
            CREATE TABLE "tenants_tenantuser" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
                "role" varchar(20) NOT NULL, 
                "tenant_id" bigint NOT NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, 
                "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED
            );
            CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
            """
        )
    ]